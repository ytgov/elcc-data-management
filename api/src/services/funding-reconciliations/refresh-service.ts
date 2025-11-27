import Big from "big.js"
import { isEmpty, upperFirst } from "lodash"
import { QueryTypes } from "@sequelize/core"

import minDecimal from "@/utils/min-decimal"
import sumByDecimal from "@/utils/sum-by-decimal"

import db, {
  FiscalPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLineJson,
  Payment,
  WageEnhancement,
} from "@/models"
import BaseService from "@/services/base-service"

export class RefreshService extends BaseService {
  constructor(private fundingReconciliation: FundingReconciliation) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    // TODO: investigate adding stale check that would return "unchanged" status code.

    const { centreId } = this.fundingReconciliation

    const updatedFundingReconciliationAdjustment =
      await this.updateFundingReconciliationAdjustments(centreId, this.fundingReconciliation.id)
    await this.updateFundingReconciliationTotalAmounts(
      this.fundingReconciliation,
      updatedFundingReconciliationAdjustment
    )

    return this.fundingReconciliation
  }

  private async updateFundingReconciliationAdjustments(
    centreId: number,
    fundingReconciliationId: number
  ) {
    // TODO: consider loading this in the controller.
    const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll({
      where: {
        fundingReconciliationId,
      },
      include: [
        {
          association: "fiscalPeriod",
          attributes: ["dateStart"],
        },
      ],
      order: [["fiscalPeriod", "dateStart", "ASC"]],
    })
    for (const [
      index,
      fundingReconciliationAdjustment,
    ] of fundingReconciliationAdjustments.entries()) {
      const { fiscalPeriodId } = fundingReconciliationAdjustment

      // TODO: consider moving each of these functions into its own service.
      // e.g. api/src/services/funding-reconciliations/refresh/calculate-funding-received-period-amount-service.ts
      const fundingReceivedPeriodAmount = await this.determineFundingReceivedPeriodAmount(
        centreId,
        fiscalPeriodId
      )
      const eligibleExpensesPeriodAmount = await this.determineEligibleExpensesPeriodAmount(
        centreId,
        fiscalPeriodId
      )
      const payrollAdjustmentsPeriodAmount = await this.determinePayrollAdjustmentsPeriodAmount(
        centreId,
        fiscalPeriodId
      )
      const cumulativeBalanceAmount = this.determineCumulativeBalanceAmount(
        fundingReconciliationAdjustments,
        index,
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount,
        payrollAdjustmentsPeriodAmount
      )
      await fundingReconciliationAdjustment.update({
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount,
        payrollAdjustmentsPeriodAmount,
        cumulativeBalanceAmount,
      })
    }

    return fundingReconciliationAdjustments
  }

  private async determineFundingReceivedPeriodAmount(
    centreId: number,
    fiscalPeriodId: number
  ): Promise<string> {
    const paymentsTotalAmountInCentsOrNull = await Payment.sum("amountInCents", {
      where: {
        centreId,
        fiscalPeriodId,
      },
    })
    const paymentsTotalAmountInCents = paymentsTotalAmountInCentsOrNull ?? 0
    const paymentsTotalAmountInDollars = Big(paymentsTotalAmountInCents).div(100)

    return paymentsTotalAmountInDollars.toFixed(4)
  }

  private async determineEligibleExpensesPeriodAmount(
    centreId: number,
    fiscalPeriodId: number
  ): Promise<string> {
    const fiscalPeriod = await FiscalPeriod.findByPk(fiscalPeriodId, {
      rejectOnEmpty: true,
    })
    const { fiscalYear: fiscalYearShort, month } = fiscalPeriod
    const fiscalYearLegacy = fiscalYearShort.replace("-", "/")
    const monthLegacy = upperFirst(month)

    // TODO: find out, or ensure that there can only be one funding submission line json per month
    // TODO: link FundingSubmissionLineJson model to a fiscal period so this query can be simplified
    const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll({
      where: {
        centreId,
        fiscalYear: fiscalYearLegacy,
        dateName: monthLegacy,
      },
    })

    if (isEmpty(fundingSubmissionLineJsons)) {
      return "0.0000"
    }

    const eligibleExpensesPeriodAmount = sumByDecimal(
      fundingSubmissionLineJsons,
      (fundingSubmissionLineJson) => {
        const { lines } = fundingSubmissionLineJson
        const linesSumAsBig = sumByDecimal(lines, "actualComputedTotal")
        return linesSumAsBig
      }
    )
    return eligibleExpensesPeriodAmount.toFixed(4)
  }

  private async determinePayrollAdjustmentsPeriodAmount(
    centreId: number,
    fiscalPeriodId: number
  ): Promise<string> {
    const employeeBenefitActualPaidAmount = await this.determineEmployeeBenefitActualPaidAmount(
      centreId,
      fiscalPeriodId
    )
    const wageEnhancementsActualTotal = await this.determineWageEnhancementsActualTotal(
      centreId,
      fiscalPeriodId
    )

    const payrollAdjustmentsPeriodAmountTotal = employeeBenefitActualPaidAmount.plus(
      wageEnhancementsActualTotal
    )

    return payrollAdjustmentsPeriodAmountTotal.toFixed(4)
  }

  private async determineEmployeeBenefitActualPaidAmount(
    centreId: number,
    fiscalPeriodId: number
  ): Promise<Big> {
    const [employeeBenefitTotals] = await db.query<{
      employerCostActualTotal: number
      grossPayrollMonthlyActualTotal: number
      costCapPercentageTotal: number
    }>(
      /* sql */ `
        SELECT
          COALESCE(SUM(employer_cost_actual), 0) as employerCostActualTotal,
          COALESCE(SUM(gross_payroll_monthly_actual), 0) as grossPayrollMonthlyActualTotal,
          COALESCE(SUM(cost_cap_percentage), 0) as costCapPercentageTotal
        FROM
          employee_benefits
        WHERE
          centre_id = :centreId
          AND fiscal_period_id = :fiscalPeriodId
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          centreId,
          fiscalPeriodId,
        },
      }
    )
    const { employerCostActualTotal, grossPayrollMonthlyActualTotal, costCapPercentageTotal } =
      employeeBenefitTotals
    const employeeBenefitActualPaidAmount = minDecimal(
      Big(employerCostActualTotal),
      Big(grossPayrollMonthlyActualTotal).mul(costCapPercentageTotal)
    )
    return employeeBenefitActualPaidAmount
  }

  private async determineWageEnhancementsActualTotal(
    centreId: number,
    fiscalPeriodId: number
  ): Promise<Big> {
    const [wageEnhancementTotals] = await db.query<{
      wageEnhancementsActualSubtotal: number
    }>(
      /* sql */ `
        SELECT
          COALESCE(
            SUM(
              wage_enhancements.hours_actual * employee_wage_tiers.wage_rate_per_hour
            ),
            0
          ) as wageEnhancementsActualSubtotal
        FROM
          wage_enhancements
          INNER JOIN employee_wage_tiers ON wage_enhancements.employee_wage_tier_id = employee_wage_tiers.id
        WHERE
          wage_enhancements.centre_id = :centreId
          AND employee_wage_tiers.fiscal_period_id = :fiscalPeriodId
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          centreId,
          fiscalPeriodId,
        },
      }
    )

    const { wageEnhancementsActualSubtotal } = wageEnhancementTotals
    const wageEnhancementsActualTotal = Big(wageEnhancementsActualSubtotal).mul(
      Big(1).plus(WageEnhancement.EI_CPP_WCB_RATE)
    )
    return wageEnhancementsActualTotal
  }

  private determineCumulativeBalanceAmount(
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[],
    index: number,
    fundingReceivedPeriodAmount: string,
    eligibleExpensesPeriodAmount: string,
    payrollAdjustmentsPeriodAmount: string
  ): string {
    let previousCumulativeBalanceAmount = Big("0")

    const previousFundingReconciliationAdjustment = fundingReconciliationAdjustments[index - 1]
    if (previousFundingReconciliationAdjustment) {
      const { cumulativeBalanceAmount } = previousFundingReconciliationAdjustment
      previousCumulativeBalanceAmount = Big(cumulativeBalanceAmount)
    }

    const cumulativeBalanceAmountAsBig = previousCumulativeBalanceAmount
      .plus(Big(fundingReceivedPeriodAmount))
      .minus(Big(eligibleExpensesPeriodAmount))
      .minus(Big(payrollAdjustmentsPeriodAmount))

    return cumulativeBalanceAmountAsBig.toFixed(4)
  }

  // TODO: investigate if this should simply take the last adjustment's data?
  private async updateFundingReconciliationTotalAmounts(
    fundingReconciliation: FundingReconciliation,
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[]
  ) {
    const totalFundingReceived = sumByDecimal(
      fundingReconciliationAdjustments,
      "fundingReceivedPeriodAmount"
    )

    const totalEligibleExpenses = sumByDecimal(
      fundingReconciliationAdjustments,
      "eligibleExpensesPeriodAmount"
    )

    const totalPayrollAdjustments = sumByDecimal(
      fundingReconciliationAdjustments,
      "payrollAdjustmentsPeriodAmount"
    )

    const finalBalanceAmount = totalFundingReceived
      .minus(totalEligibleExpenses)
      .minus(totalPayrollAdjustments)

    await fundingReconciliation.update({
      fundingReceivedTotalAmount: totalFundingReceived.toFixed(4),
      eligibleExpensesTotalAmount: totalEligibleExpenses.toFixed(4),
      payrollAdjustmentsTotalAmount: totalPayrollAdjustments.toFixed(4),
      finalBalanceAmount: finalBalanceAmount.toFixed(4),
    })
  }
}

export default RefreshService
