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

    const employeeWageTiersAttributes = fiscalPeriods.flatMap((fiscalPeriod) =>
      EMPLOYEE_WAGE_TIER_DEFAULTS.map((employeeWageTier) => ({
        fiscalPeriodId: fiscalPeriod.id,
        ...employeeWageTier,
      }))
    )

    return EmployeeWageTier.bulkCreate(employeeWageTiersAttributes)
  }
}

export default BulkCreateService
