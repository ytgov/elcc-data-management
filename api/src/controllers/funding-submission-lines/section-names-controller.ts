import logger from "@/utils/logger"

import { FundingSubmissionLine } from "@/models"
import { FundingSubmissionLinePolicy } from "@/policies"
import { IndexService } from "@/services/funding-submission-lines/section-names"
import BaseController from "@/controllers/base-controller"

export class SectionNamesController extends BaseController<FundingSubmissionLine> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["sectionName", "ASC"]])

      const scopedModel = FundingSubmissionLinePolicy.applyScope(scopes, this.currentUser)
      const sectionNames = await IndexService.perform(scopedModel, where, order, this.currentUser)

      return this.response.json({
        sectionNames,
      })
    } catch (error) {
      logger.error(`Error fetching funding submission line section names: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding submission line section names: ${error}`,
      })
    }
  }
}

export default SectionNamesController
