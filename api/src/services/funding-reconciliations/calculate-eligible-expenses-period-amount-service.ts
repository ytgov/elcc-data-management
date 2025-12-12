import Big from "big.js"
import { upperFirst } from "lodash"
import { QueryTypes } from "@sequelize/core"

import db, { FiscalPeriod } from "@/models"
import BaseService from "@/services/base-service"

export class CalculateEligibleExpensesPeriodAmountService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform(): Promise<string> {
    const fundingSubmissionExpensesAmount = await this.calculateFundingSubmissionExpenses()
    const buildingExpensesTotalAmount = await this.calculateBuildingExpenses()

    const totalEligibleExpenses = Big(fundingSubmissionExpensesAmount).plus(
      buildingExpensesTotalAmount
    )

    return totalEligibleExpenses.toFixed(4)
  }

  private async calculateFundingSubmissionExpenses(): Promise<string> {
    const fiscalPeriod = await FiscalPeriod.findByPk(this.fiscalPeriodId, {
      rejectOnEmpty: true,
    })
    const { fiscalYear: fiscalYearShort, month } = fiscalPeriod
    const fiscalYearLegacy = fiscalYearShort.replace("-", "/")
    const monthLegacy = upperFirst(month)

    // TODO: find out, or ensure that there can only be one funding submission line json per month
    // TODO: link FundingSubmissionLineJson model to a fiscal period so this query can be simplified
    const [fundingSubmissionResult] = await db.query<{
      fundingSubmissionExpensesAmount: number
    }>(
      /* sql */ `
        SELECT
          COALESCE(
            SUM(
              CAST(
                JSON_VALUE(json_array_element.value, '$.actualComputedTotal') AS DECIMAL(15, 4)
              )
            ),
            0
          ) as fundingSubmissionExpensesAmount
        FROM
          funding_submission_line_jsons
          CROSS APPLY OPENJSON (funding_submission_line_jsons.[values]) AS json_array_element
        WHERE
          funding_submission_line_jsons.centre_id = :centreId
          AND funding_submission_line_jsons.fiscal_year = :fiscalYear
          AND funding_submission_line_jsons.date_name = :dateName
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          centreId: this.centreId,
          fiscalYear: fiscalYearLegacy,
          dateName: monthLegacy,
        },
      }
    )

    const { fundingSubmissionExpensesAmount } = fundingSubmissionResult

    return Big(fundingSubmissionExpensesAmount).toFixed(4)
  }

  private async calculateBuildingExpenses(): Promise<string> {
    const [buildingExpensesResult] = await db.query<{
      buildingExpensesTotalAmount: number
    }>(
      /* sql */ `
        SELECT
          COALESCE(SUM(total_cost), 0) as buildingExpensesTotalAmount
        FROM
          building_expenses
        WHERE
          centre_id = :centreId
          AND fiscal_period_id = :fiscalPeriodId
          AND deleted_at IS NULL
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          centreId: this.centreId,
          fiscalPeriodId: this.fiscalPeriodId,
        },
      }
    )

    const { buildingExpensesTotalAmount } = buildingExpensesResult

    return Big(buildingExpensesTotalAmount).toFixed(4)
  }
}

export default CalculateEligibleExpensesPeriodAmountService
