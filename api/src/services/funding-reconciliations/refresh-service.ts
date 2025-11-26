import Big from "big.js"
import { isEmpty, upperFirst } from "lodash"

import {
  FiscalPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLineJson,
  Payment,
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
      const fundingReceivedPeriodAmount = await this.determineFundingReceivedPeriodAmount(
        centreId,
        fiscalPeriodId
      )
      const eligibleExpensesPeriodAmount = await this.determineEligibleExpensesPeriodAmount(
        centreId,
        fiscalPeriodId
      )
      const cumulativeBalanceAmount = this.determineCumulativeBalanceAmount(
        fundingReconciliationAdjustments,
        index,
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount
      )
      await fundingReconciliationAdjustment.update({
        fundingReceivedPeriodAmount,
        eligibleExpensesPeriodAmount,
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

    const eligibleExpensesPeriodAmount = fundingSubmissionLineJsons.reduce(
      (sumAsBig, fundingSubmissionLineJson) => {
        const { lines } = fundingSubmissionLineJson
        const linesSumAsBig = lines.reduce((sumAsBig, line) => {
          const actualComputedTotalAsBig = Big(line.actualComputedTotal)
          return sumAsBig.plus(actualComputedTotalAsBig)
        }, new Big(0))
        return sumAsBig.plus(linesSumAsBig)
      },
      new Big(0)
    )
    return eligibleExpensesPeriodAmount.toFixed(4)
  }

  private determineCumulativeBalanceAmount(
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[],
    index: number,
    fundingReceivedPeriodAmount: string,
    eligibleExpensesPeriodAmount: string
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
    return cumulativeBalanceAmountAsBig.toFixed(4)
  }

  private async updateFundingReconciliationTotalAmounts(
    fundingReconciliation: FundingReconciliation,
    fundingReconciliationAdjustments: FundingReconciliationAdjustment[]
  ) {
    const totalFundingReceived = fundingReconciliationAdjustments.reduce((sumAsBig, adjustment) => {
      const fundingReceivedPeriodAmountAsBig = Big(adjustment.fundingReceivedPeriodAmount)
      return sumAsBig.plus(fundingReceivedPeriodAmountAsBig)
    }, new Big(0))

    const totalEligibleExpenses = fundingReconciliationAdjustments.reduce(
      (sumAsBig, adjustment) => {
        const eligibleExpensesPeriodAmountAsBig = Big(adjustment.eligibleExpensesPeriodAmount)
        return sumAsBig.plus(eligibleExpensesPeriodAmountAsBig)
      },
      new Big(0)
    )

    const finalBalanceAmount = totalFundingReceived.minus(totalEligibleExpenses)

    await fundingReconciliation.update({
      fundingReceivedTotalAmount: totalFundingReceived.toFixed(4),
      eligibleExpensesTotalAmount: totalEligibleExpenses.toFixed(4),
      payrollAdjustmentsTotalAmount: "0.0000",
      finalBalanceAmount: finalBalanceAmount.toFixed(4),
    })
  }
}

export default RefreshService
