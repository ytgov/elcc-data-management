import { isEmpty } from "lodash"

import { EmployeeWageTier, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForFundingPeriodService from "@/services/employee-wage-tiers/bulk-create-for-funding-period-service"

export class BulkEnsureForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<EmployeeWageTier[]> {
    const employeeWageTiers = await EmployeeWageTier.findAll({
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId: this.fundingPeriod.id,
          },
        },
      ],
    })
    if (!isEmpty(employeeWageTiers)) return employeeWageTiers

    return BulkCreateForFundingPeriodService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureForFundingPeriodService
