import { Centre, FundingSubmissionLineJson } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForCentreService from "@/services/funding-submission-line-jsons/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.findAll({
      where: {
        centreId: this.centre.id,
      },
    })
    if (fundingSubmissionLineJsonCount.length > 0) return

    await BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
