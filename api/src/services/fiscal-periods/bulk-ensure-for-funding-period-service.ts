import { FiscalPeriod, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForFundingPeriodService from "@/services/fiscal-periods/bulk-create-for-funding-period-service"

export class BulkEnsureForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const fiscalPeriodsCount = await FiscalPeriod.count({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (fiscalPeriodsCount > 0) return

    return BulkCreateForFundingPeriodService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureForFundingPeriodService
