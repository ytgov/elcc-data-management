import { isEmpty } from "lodash"

import { FiscalPeriod, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/funding-periods/fiscal-periods/bulk-create-service"

export class BulkEnsureService extends BaseService {
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

    return BulkCreateService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureService
