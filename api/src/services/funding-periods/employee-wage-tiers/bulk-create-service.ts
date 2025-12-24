import { Op, sql } from "@sequelize/core"
import { isEmpty } from "lodash"

import { EmployeeWageTier, FiscalPeriod, FundingPeriod } from "@/models"
import { EMPLOYEE_WAGE_TIER_DEFAULTS } from "@/models/employee-wage-tier"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<EmployeeWageTier[]> {
    const fiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (isEmpty(fiscalPeriods)) {
      throw new Error("No fiscal periods found for funding period.")
    }

    const employeeWageTierDefaults = await this.buildEmployeeWageTierDefaults()

    const employeeWageTiersAttributes = fiscalPeriods.flatMap((fiscalPeriod) =>
      employeeWageTierDefaults.map((employeeWageTierDefault) => ({
        fiscalPeriodId: fiscalPeriod.id,
        ...employeeWageTierDefault,
      }))
    )

    return EmployeeWageTier.bulkCreate(employeeWageTiersAttributes)
  }

  private async buildEmployeeWageTierDefaults() {
    const newestFiscalPeriodWithEmployeeWageTiers = sql`
      (
        SELECT
          TOP 1 fiscal_periods.id
        FROM
          fiscal_periods
          INNER JOIN employee_wage_tiers ON employee_wage_tiers.fiscal_period_id = fiscal_periods.id
        ORDER BY
          fiscal_periods.date_end DESC,
          fiscal_periods.id DESC
      )
    `
    const newestEmployeeWageTiers = await EmployeeWageTier.findAll({
      include: [
        {
          association: "fiscalPeriod",
          where: {
            id: {
              [Op.in]: newestFiscalPeriodWithEmployeeWageTiers,
            },
          },
        },
      ],
    })

    if (isEmpty(newestEmployeeWageTiers)) {
      return EMPLOYEE_WAGE_TIER_DEFAULTS
    }

    return newestEmployeeWageTiers.map(({ tierLevel, tierLabel, wageRatePerHour }) => ({
      tierLevel,
      tierLabel,
      wageRatePerHour,
    }))
  }
}

export default BulkCreateService
