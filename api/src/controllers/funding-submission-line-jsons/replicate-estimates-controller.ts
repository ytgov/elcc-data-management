import { isNil } from "lodash"

import { FundingSubmissionLineJson } from "@/models"
import BaseController from "@/controllers/base-controller"
import { ReplicateEstimatesService } from "@/services/funding-submission-line-jsons"

export class ReplicateEstimatesController extends BaseController {
  async create() {
    try {
      const fundingSubmissionLineJson = await this.loadFundingSubmissionLineJson()
      if (isNil(fundingSubmissionLineJson)) {
        return this.response.status(404).json({
          message: "Funding submission line json not found",
        })
      }

      await ReplicateEstimatesService.perform(fundingSubmissionLineJson)
      return this.response
        .status(201)
        .json({ message: "Replicated estimates to later submissions." })
    } catch (error) {
      return this.response.status(422).json({
        message: `Error replicating estimates: ${error}`,
      })
    }
  }

  async loadFundingSubmissionLineJson() {
    return FundingSubmissionLineJson.findByPk(this.params.fundingSubmissionLineJsonId)
  }
}

export default ReplicateEstimatesController
