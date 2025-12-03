import { isNil } from "lodash"

import logger from "@/utils/logger"

import { FundingReconciliationAdjustment } from "@/models"
import { FundingReconciliationAdjustmentPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/funding-reconciliation-adjustments"
import { IndexSerializer, ShowSerializer } from "@/serializers/funding-reconciliation-adjustments"
import BaseController from "@/controllers/base-controller"

export class FundingReconciliationAdjustmentsController extends BaseController<FundingReconciliationAdjustment> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedFundingReconciliationAdjustments =
        FundingReconciliationAdjustmentPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedFundingReconciliationAdjustments.count({ where })
      const fundingReconciliationAdjustments = await scopedFundingReconciliationAdjustments.findAll(
        {
          where,
          order,
          limit: this.pagination.limit,
          offset: this.pagination.offset,
        }
      )
      const serializedFundingReconciliationAdjustments = IndexSerializer.perform(
        fundingReconciliationAdjustments
      )
      return this.response.json({
        fundingReconciliationAdjustments: serializedFundingReconciliationAdjustments,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching funding reconciliation adjustments: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding reconciliation adjustments: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingReconciliationAdjustment = await this.loadFundingReconciliationAdjustment()
      if (isNil(fundingReconciliationAdjustment)) {
        return this.response.status(404).json({
          message: "Funding reconciliation adjustment not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliationAdjustment)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this funding reconciliation adjustment",
        })
      }

      const serializedFundingReconciliationAdjustment = ShowSerializer.perform(
        fundingReconciliationAdjustment
      )
      return this.response.json({
        fundingReconciliationAdjustment: serializedFundingReconciliationAdjustment,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching funding reconciliation adjustment: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding reconciliation adjustment: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create funding reconciliation adjustments",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const fundingReconciliationAdjustment = await CreateService.perform(permittedAttributes)

      const serializedFundingReconciliationAdjustment = ShowSerializer.perform(
        fundingReconciliationAdjustment
      )
      return this.response.status(201).json({
        fundingReconciliationAdjustment: serializedFundingReconciliationAdjustment,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating funding reconciliation adjustment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating funding reconciliation adjustment: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingReconciliationAdjustment = await this.loadFundingReconciliationAdjustment()
      if (isNil(fundingReconciliationAdjustment)) {
        return this.response.status(404).json({
          message: "Funding reconciliation adjustment not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliationAdjustment)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this funding reconciliation adjustment",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedFundingReconciliationAdjustment = await UpdateService.perform(
        fundingReconciliationAdjustment,
        permittedAttributes
      )
      const serializedFundingReconciliationAdjustment = ShowSerializer.perform(
        updatedFundingReconciliationAdjustment
      )
      return this.response.json({
        fundingReconciliationAdjustment: serializedFundingReconciliationAdjustment,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating funding reconciliation adjustment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating funding reconciliation adjustment: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingReconciliationAdjustment = await this.loadFundingReconciliationAdjustment()
      if (isNil(fundingReconciliationAdjustment)) {
        return this.response.status(404).json({
          message: "Funding reconciliation adjustment not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliationAdjustment)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this funding reconciliation adjustment",
        })
      }

      await fundingReconciliationAdjustment.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting funding reconciliation adjustment: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting funding reconciliation adjustment: ${error}`,
      })
    }
  }

  private loadFundingReconciliationAdjustment() {
    return FundingReconciliationAdjustment.findByPk(this.params.fundingReconciliationAdjustmentId, {
      include: [
        {
          association: "fundingReconciliation",
        },
        {
          association: "fiscalPeriod",
        },
      ],
    })
  }

  private buildPolicy(
    fundingReconciliationAdjustment: FundingReconciliationAdjustment = FundingReconciliationAdjustment.build()
  ) {
    return new FundingReconciliationAdjustmentPolicy(
      this.currentUser,
      fundingReconciliationAdjustment
    )
  }
}
