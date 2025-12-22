import { isEmpty } from "lodash"

import { Centre, FundingReconciliationAdjustment } from "@/models"
import BaseService from "@/services/base-service"
import { FundingPeriods, FundingReconciliations } from "@/services"
import BulkCreateForCentreService from "@/services/funding-reconciliation-adjustments/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment[]> {
    const fundingPeriod = await FundingPeriods.EnsureCurrentService.perform()
    const fundingReconciliation = await FundingReconciliations.BulkEnsureForCentreService.perform(
      this.centre
    )

    const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll({
      where: {
        fundingReconciliationId: fundingReconciliation.id,
      },
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId: fundingPeriod.id,
          },
        },
      ],
    })

    if (!isEmpty(fundingReconciliationAdjustments)) return fundingReconciliationAdjustments

    return BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
