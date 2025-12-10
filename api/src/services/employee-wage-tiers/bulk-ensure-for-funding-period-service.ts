import { EmployeeWageTier, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForFundingPeriodService from "@/services/employee-wage-tiers/bulk-create-for-funding-period-service"

export class BulkEnsureForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const employeeWageTierCount = await EmployeeWageTier.count({
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId: this.fundingPeriod.id,
          },
        },
      ],
    })
    if (employeeWageTierCount > 0) return

    await BulkCreateForFundingPeriodService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureForFundingPeriodService
