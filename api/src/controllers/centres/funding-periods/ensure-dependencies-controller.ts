import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Centre, FundingPeriod } from "@/models"
import { CentrePolicy } from "@/policies/centre-policy"
import { EnsureDependenciesService } from "@/services/funding-periods"

import BaseController from "@/controllers/base-controller"

export class EnsureDependenciesController extends BaseController {
  async create() {
    try {
      const centre = await this.loadCentre()
      if (isNil(centre)) {
        return this.response.status(404).json({
          message: "Centre not found",
        })
      }

      const fundingPeriod = await this.loadFundingPeriod()
      if (isNil(fundingPeriod)) {
        return this.response.status(404).json({
          message: "Funding period not found",
        })
      }

      const policy = this.buildPolicy(centre)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this centre",
        })
      }

      const fundingSubmissionLineJsons = await EnsureDependenciesService.perform(
        centre,
        fundingPeriod
      )

      return this.response.status(201).json({
        fundingSubmissionLineJsons,
      })
    } catch (error) {
      logger.error(`Error ensuring centre funding period dependencies: ${error}`, { error })

      return this.response.status(422).json({
        message: `Error ensuring centre funding period dependencies: ${error}`,
      })
    }
  }

  private loadCentre() {
    return Centre.findByPk(this.params.centreId)
  }

  private loadFundingPeriod() {
    return FundingPeriod.findByPk(this.params.fundingPeriodId)
  }

  private buildPolicy(centre: Centre = Centre.build()) {
    return new CentrePolicy(this.currentUser, centre)
  }
}

export default EnsureDependenciesController
