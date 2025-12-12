import { Centre, FundingReconciliationAdjustment } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForCentreService from "@/services/funding-reconciliation-adjustments/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const fundingReconciliationAdjustmentCount = await FundingReconciliationAdjustment.count({
      include: [
        {
          association: "fundingReconciliation",
          where: {
            centreId: this.centre.id,
          },
        },
      ],
    })

    if (fundingReconciliationAdjustmentCount > 0) return

    await BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
