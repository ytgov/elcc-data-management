import { isNil } from "lodash"

import logger from "@/utils/logger"
import { FundingRegion } from "@/models"
import { FundingRegionPolicy } from "@/policies/funding-region-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/funding-regions"
import { IndexSerializer, ShowSerializer } from "@/serializers/funding-regions"
import BaseController from "@/controllers/base-controller"

export class FundingRegionsController extends BaseController<FundingRegion> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["region", "ASC"]])
      const scopedFundingRegions = FundingRegionPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedFundingRegions.count({ where })
      const fundingRegions = await scopedFundingRegions.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedFundingRegions = IndexSerializer.perform(fundingRegions)
      return this.response.json({
        fundingRegions: serializedFundingRegions,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching funding regions: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding regions: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingRegion = await this.loadFundingRegion()
      if (isNil(fundingRegion)) {
        return this.response.status(404).json({
          message: "Funding region not found",
        })
      }

      const policy = this.buildPolicy(fundingRegion)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this funding region",
        })
      }

      const serializedFundingRegion = ShowSerializer.perform(fundingRegion)
      return this.response.json({
        fundingRegion: serializedFundingRegion,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching funding region: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding region: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create funding regions",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const fundingRegion = await CreateService.perform(permittedAttributes, this.currentUser)
      const serializedFundingRegion = ShowSerializer.perform(fundingRegion)
      return this.response.status(201).json({
        fundingRegion: serializedFundingRegion,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating funding region: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating funding region: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingRegion = await this.loadFundingRegion()
      if (isNil(fundingRegion)) {
        return this.response.status(404).json({
          message: "Funding region not found",
        })
      }

      const policy = this.buildPolicy(fundingRegion)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this funding region",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedFundingRegion = await UpdateService.perform(
        fundingRegion,
        permittedAttributes,
        this.currentUser
      )
      const serializedFundingRegion = ShowSerializer.perform(updatedFundingRegion)
      return this.response.json({
        fundingRegion: serializedFundingRegion,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating funding region: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating funding region: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingRegion = await this.loadFundingRegion()
      if (isNil(fundingRegion)) {
        return this.response.status(404).json({
          message: "Funding region not found",
        })
      }

      const policy = this.buildPolicy(fundingRegion)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this funding region",
        })
      }

      await DestroyService.perform(fundingRegion, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting funding region: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting funding region: ${error}`,
      })
    }
  }

  private loadFundingRegion() {
    return FundingRegion.findByPk(this.params.fundingRegionId)
  }

  private buildPolicy(fundingRegion: FundingRegion = FundingRegion.build()) {
    return new FundingRegionPolicy(this.currentUser, fundingRegion)
  }
}

export default FundingRegionsController
