import Big from "big.js"
import { QueryTypes } from "@sequelize/core"

import minDecimal from "@/utils/min-decimal"

import db, { WageEnhancement } from "@/models"
import BaseService from "@/services/base-service"

export class CalculatePayrollAdjustmentsPeriodAmountService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform(): Promise<string> {
    const employeeBenefitActualPaidAmount = await this.determineEmployeeBenefitActualPaidAmount()
    const wageEnhancementsActualTotal = await this.determineWageEnhancementsActualTotal()

    const payrollAdjustmentsPeriodAmountTotal = employeeBenefitActualPaidAmount.plus(
      wageEnhancementsActualTotal
    )

    return payrollAdjustmentsPeriodAmountTotal.toFixed(4)
  }

  private async determineEmployeeBenefitActualPaidAmount(): Promise<Big> {
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
          centreId: this.centreId,
          fiscalPeriodId: this.fiscalPeriodId,
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

  private async determineWageEnhancementsActualTotal(): Promise<Big> {
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
          centreId: this.centreId,
          fiscalPeriodId: this.fiscalPeriodId,
        },
      }
    )

    const { wageEnhancementsActualSubtotal } = wageEnhancementTotals
    const wageEnhancementsActualTotal = Big(wageEnhancementsActualSubtotal).mul(
      Big(1).plus(WageEnhancement.EI_CPP_WCB_RATE)
    )

    return wageEnhancementsActualTotal
  }
}

export default CalculatePayrollAdjustmentsPeriodAmountService
