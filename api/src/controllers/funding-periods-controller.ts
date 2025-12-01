import { isNil } from "lodash"

import logger from "@/utils/logger"
import { FundingPeriod } from "@/models"
import { FundingPeriodPolicy } from "@/policies"
import { CreateService, DestroyService, UpdateService } from "@/services/funding-periods"
import { IndexSerializer, ShowSerializer } from "@/serializers/funding-periods"
import BaseController from "@/controllers/base-controller"

export class FundingPeriodsController extends BaseController<FundingPeriod> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([
        ["fromDate", "ASC"],
        ["toDate", "ASC"],
      ])
      const scopedFundingPeriods = FundingPeriodPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedFundingPeriods.count({ where })
      const fundingPeriods = await scopedFundingPeriods.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedFundingPeriods = IndexSerializer.perform(fundingPeriods)
      return this.response.json({
        fundingPeriods: serializedFundingPeriods,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching funding periods: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding periods: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingPeriod = await this.loadFundingPeriod()
      if (isNil(fundingPeriod)) {
        return this.response.status(404).json({
          message: "Funding period not found",
        })
      }

      const policy = this.buildPolicy(fundingPeriod)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this funding period",
        })
      }

      const serializedFundingPeriod = ShowSerializer.perform(fundingPeriod)
      return this.response.json({
        fundingPeriod: serializedFundingPeriod,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching funding period: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding period: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create funding periods",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const fundingPeriod = await CreateService.perform(permittedAttributes)
      const serializedFundingPeriod = ShowSerializer.perform(fundingPeriod)
      return this.response.status(201).json({
        fundingPeriod: serializedFundingPeriod,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating funding period: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating funding period: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingPeriod = await this.loadFundingPeriod()
      if (isNil(fundingPeriod)) {
        return this.response.status(404).json({
          message: "Funding period not found",
        })
      }

      const policy = this.buildPolicy(fundingPeriod)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this funding period",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedFundingPeriod = await UpdateService.perform(fundingPeriod, permittedAttributes)
      const serializedFundingPeriod = ShowSerializer.perform(updatedFundingPeriod)
      return this.response.json({
        fundingPeriod: serializedFundingPeriod,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating funding period: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating funding period: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingPeriod = await this.loadFundingPeriod()
      if (isNil(fundingPeriod)) {
        return this.response.status(404).json({
          message: "Funding period not found",
        })
      }

      const policy = this.buildPolicy(fundingPeriod)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this funding period",
        })
      }

      await DestroyService.perform(fundingPeriod)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting funding period: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting funding period: ${error}`,
      })
    }
  }

  private loadFundingPeriod() {
    return FundingPeriod.findByPk(this.params.fundingPeriodId)
  }

  private buildPolicy(fundingPeriod: FundingPeriod = FundingPeriod.build()) {
    return new FundingPeriodPolicy(this.currentUser, fundingPeriod)
  }
}

export default FundingPeriodsController
