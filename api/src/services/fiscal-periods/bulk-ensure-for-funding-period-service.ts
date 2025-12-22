import { isEmpty } from "lodash"

import { FiscalPeriod, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForFundingPeriodService from "@/services/fiscal-periods/bulk-create-for-funding-period-service"

export class BulkEnsureForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<FiscalPeriod[]> {
    const fiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (!isEmpty(fiscalPeriods)) return fiscalPeriods

    return BulkCreateForFundingPeriodService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureForFundingPeriodService
