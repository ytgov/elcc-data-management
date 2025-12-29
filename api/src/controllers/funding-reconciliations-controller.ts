import { isNil } from "lodash"

import logger from "@/utils/logger"
import { FundingReconciliation } from "@/models"
import { FundingReconciliationPolicy } from "@/policies"
import { CreateService, DestroyService, UpdateService } from "@/services/funding-reconciliations"
import { IndexSerializer, ShowSerializer } from "@/serializers/funding-reconciliations"
import BaseController from "@/controllers/base-controller"

export class FundingReconciliationsController extends BaseController<FundingReconciliation> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedReconciliations = FundingReconciliationPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedReconciliations.count({ where })
      const fundingReconciliations = await scopedReconciliations.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedReconciliations = IndexSerializer.perform(fundingReconciliations)
      return this.response.json({
        fundingReconciliations: serializedReconciliations,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching funding reconciliations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding reconciliations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const fundingReconciliation = await this.loadFundingReconciliation()
      if (isNil(fundingReconciliation)) {
        return this.response.status(404).json({
          message: "Funding reconciliation not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliation)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this funding reconciliation",
        })
      }

      const serializedReconciliation = ShowSerializer.perform(fundingReconciliation)
      return this.response.json({
        fundingReconciliation: serializedReconciliation,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching funding reconciliation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching funding reconciliation: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create funding reconciliations",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const fundingReconciliation = await CreateService.perform(permittedAttributes)

      const serializedReconciliation = ShowSerializer.perform(fundingReconciliation)
      return this.response.status(201).json({
        fundingReconciliation: serializedReconciliation,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating funding reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating funding reconciliation: ${error}`,
      })
    }
  }

  async update() {
    try {
      const fundingReconciliation = await this.loadFundingReconciliation()
      if (isNil(fundingReconciliation)) {
        return this.response.status(404).json({
          message: "Funding reconciliation not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliation)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this funding reconciliation",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedReconciliation = await UpdateService.perform(
        fundingReconciliation,
        permittedAttributes
      )
      const serializedReconciliation = ShowSerializer.perform(updatedReconciliation)
      return this.response.json({
        fundingReconciliation: serializedReconciliation,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating funding reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating funding reconciliation: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const fundingReconciliation = await this.loadFundingReconciliation()
      if (isNil(fundingReconciliation)) {
        return this.response.status(404).json({
          message: "Funding reconciliation not found",
        })
      }

      const policy = this.buildPolicy(fundingReconciliation)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this funding reconciliation",
        })
      }

      await DestroyService.perform(fundingReconciliation, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting funding reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting funding reconciliation: ${error}`,
      })
    }
  }

  private loadFundingReconciliation() {
    return FundingReconciliation.findByPk(this.params.fundingReconciliationId, {
      include: [
        {
          association: "adjustments",
        },
      ],
    })
  }

  private buildPolicy(
    fundingReconciliation: FundingReconciliation = FundingReconciliation.build()
  ) {
    return new FundingReconciliationPolicy(this.currentUser, fundingReconciliation)
  }
}
