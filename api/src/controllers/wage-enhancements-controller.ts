import { isNil } from "lodash"

import logger from "@/utils/logger"
import { WageEnhancement } from "@/models"
import { WageEnhancementPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/wage-enhancements"
import { IndexSerializer, ShowSerializer } from "@/serializers/wage-enhancements"
import BaseController from "@/controllers/base-controller"

export class WageEnhancementsController extends BaseController<WageEnhancement> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedWageEnhancements = WageEnhancementPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedWageEnhancements.count({ where })
      const wageEnhancements = await scopedWageEnhancements.findAll({
        include: ["employeeWageTier"],
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedWageEnhancements = IndexSerializer.perform(wageEnhancements)
      return this.response.json({
        wageEnhancements: serializedWageEnhancements,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching wage enhancements: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching wage enhancements: ${error}`,
      })
    }
  }

  async show() {
    try {
      const wageEnhancement = await this.loadWageEnhancement()
      if (isNil(wageEnhancement)) {
        return this.response.status(404).json({
          message: "Wage enhancement not found",
        })
      }

      const policy = this.buildPolicy(wageEnhancement)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this wage enhancement",
        })
      }

      const serializedWageEnhancement = ShowSerializer.perform(wageEnhancement)
      return this.response.json({
        wageEnhancement: serializedWageEnhancement,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching wage enhancement: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching wage enhancement: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create wage enhancements",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const wageEnhancement = await CreateService.perform(permittedAttributes, this.currentUser)
      const serializedWageEnhancement = ShowSerializer.perform(wageEnhancement)
      return this.response.status(201).json({
        wageEnhancement: serializedWageEnhancement,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating wage enhancement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating wage enhancement: ${error}`,
      })
    }
  }

  async update() {
    try {
      const wageEnhancement = await this.loadWageEnhancement()
      if (isNil(wageEnhancement)) {
        return this.response.status(404).json({
          message: "Wage enhancement not found",
        })
      }

      const policy = this.buildPolicy(wageEnhancement)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this wage enhancement",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedWageEnhancement = await UpdateService.perform(
        wageEnhancement,
        permittedAttributes,
        this.currentUser
      )
      const serializedWageEnhancement = ShowSerializer.perform(updatedWageEnhancement)
      return this.response.json({
        wageEnhancement: serializedWageEnhancement,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating wage enhancement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating wage enhancement: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const wageEnhancement = await this.loadWageEnhancement()
      if (isNil(wageEnhancement)) {
        return this.response.status(404).json({
          message: "Wage enhancement not found",
        })
      }

      const policy = this.buildPolicy(wageEnhancement)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this wage enhancement",
        })
      }

      await wageEnhancement.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting wage enhancement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting wage enhancement: ${error}`,
      })
    }
  }

  private loadWageEnhancement(): Promise<WageEnhancement | null> {
    return WageEnhancement.findByPk(this.params.wageEnhancementId, {
      include: ["employeeWageTier"],
    })
  }

  private buildPolicy(wageEnhancement: WageEnhancement = WageEnhancement.build()) {
    return new WageEnhancementPolicy(this.currentUser, wageEnhancement)
  }
}

export default WageEnhancementsController
