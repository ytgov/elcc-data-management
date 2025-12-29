import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Centre, FundingPeriod } from "@/models"
import { CentrePolicy } from "@/policies/centre-policy"
import { InitializeService, IsInitializedService } from "@/services/centres/funding-periods"

import BaseController from "@/controllers/base-controller"

export class InitializeController extends BaseController {
  async show() {
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
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this centre",
        })
      }

      const initializationStatus = await IsInitializedService.perform(centre, fundingPeriod)

      return this.response.json({
        initializationStatus,
      })
    } catch (error) {
      logger.error(`Error checking centre funding period initialization status: ${error}`, {
        error,
      })

      return this.response.status(400).json({
        message: `Error checking centre funding period initialization status: ${error}`,
      })
    }
  }

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

      const initializationStatus = await InitializeService.perform(centre, fundingPeriod)
      return this.response.status(201).json({
        initializationStatus,
      })
    } catch (error) {
      logger.error(`Error initializing centre funding period: ${error}`, { error })

      return this.response.status(422).json({
        message: `Error initializing centre funding period: ${error}`,
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

export default InitializeController
