import { Centre, FundingReconciliation } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForCentreService from "@/services/funding-reconciliations/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const fundingReconciliationCount = await FundingReconciliation.count({
      where: {
        centreId: this.centre.id,
      },
    })

    if (fundingReconciliationCount > 0) return

    await BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
