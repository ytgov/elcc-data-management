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
    const fiscalPeriod = await FiscalPeriod.findByPk(this.fiscalPeriodId, {
      rejectOnEmpty: true,
    })
    const { fiscalYear: fiscalYearShort, month } = fiscalPeriod
    const fiscalYearLegacy = fiscalYearShort.replace("-", "/")
    const monthLegacy = upperFirst(month)

    // TODO: find out, or ensure that there can only be one funding submission line json per month
    // TODO: link FundingSubmissionLineJson model to a fiscal period so this query can be simplified
    const [result] = await db.query<{
      eligibleExpensesPeriodAmount: number
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
          ) as eligibleExpensesPeriodAmount
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

    const { eligibleExpensesPeriodAmount } = result

    return Big(eligibleExpensesPeriodAmount).toFixed(4)
  }
}

export default CalculateEligibleExpensesPeriodAmountService
