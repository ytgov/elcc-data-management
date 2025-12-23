import { isEmpty } from "lodash"

import { EmployeeWageTier, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/funding-periods/employee-wage-tiers/bulk-create-service"

export class BulkEnsureService extends BaseService {
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

    return BulkCreateService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureService
