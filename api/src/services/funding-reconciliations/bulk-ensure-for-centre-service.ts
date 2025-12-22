import { isNil } from "lodash"

import { Centre, FundingReconciliation } from "@/models"
import BaseService from "@/services/base-service"
import { FundingPeriods } from "@/services"
import BulkCreateForCentreService from "@/services/funding-reconciliations/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    const fundingPeriod = await FundingPeriods.EnsureCurrentService.perform()

    const fundingReconciliation = await FundingReconciliation.findOne({
      where: {
        centreId: this.centre.id,
        fundingPeriodId: fundingPeriod.id,
      },
    })

    if (!isNil(fundingReconciliation)) return fundingReconciliation

    return BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
