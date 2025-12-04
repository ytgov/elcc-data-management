import { isNil } from "lodash"

import logger from "@/utils/logger"
import { BuildingExpense } from "@/models"
import { BuildingExpensePolicy } from "@/policies"
import { CreateService, DestroyService, UpdateService } from "@/services/building-expenses"
import { IndexSerializer, ShowSerializer } from "@/serializers/building-expenses"
import BaseController from "@/controllers/base-controller"

export class BuildingExpensesController extends BaseController<BuildingExpense> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["createdAt", "DESC"]])
      const scopedBuildingExpenses = BuildingExpensePolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedBuildingExpenses.count({ where })
      const buildingExpenses = await scopedBuildingExpenses.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedBuildingExpenses = IndexSerializer.perform(buildingExpenses)
      return this.response.json({
        buildingExpenses: serializedBuildingExpenses,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching building expenses: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching building expenses: ${error}`,
      })
    }
  }

  async show() {
    try {
      const buildingExpense = await this.loadBuildingExpense()
      if (isNil(buildingExpense)) {
        return this.response.status(404).json({
          message: "Building expense not found",
        })
      }

      const policy = this.buildPolicy(buildingExpense)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this building expense",
        })
      }

      const serializedBuildingExpense = ShowSerializer.perform(buildingExpense)
      return this.response.json({
        buildingExpense: serializedBuildingExpense,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching building expense: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching building expense: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create building expenses",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const buildingExpense = await CreateService.perform(permittedAttributes, this.currentUser)
      const serializedBuildingExpense = ShowSerializer.perform(buildingExpense)
      return this.response.status(201).json({
        buildingExpense: serializedBuildingExpense,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating building expense: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating building expense: ${error}`,
      })
    }
  }

  async update() {
    try {
      const buildingExpense = await this.loadBuildingExpense()
      if (isNil(buildingExpense)) {
        return this.response.status(404).json({
          message: "Building expense not found",
        })
      }

      const policy = this.buildPolicy(buildingExpense)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this building expense",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedBuildingExpense = await UpdateService.perform(
        buildingExpense,
        permittedAttributes,
        this.currentUser
      )
      const serializedBuildingExpense = ShowSerializer.perform(updatedBuildingExpense)
      return this.response.json({
        buildingExpense: serializedBuildingExpense,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating building expense: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating building expense: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const buildingExpense = await this.loadBuildingExpense()
      if (isNil(buildingExpense)) {
        return this.response.status(404).json({
          message: "Building expense not found",
        })
      }

      const policy = this.buildPolicy(buildingExpense)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this building expense",
        })
      }

      await DestroyService.perform(buildingExpense, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting building expense: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting building expense: ${error}`,
      })
    }
  }

  private loadBuildingExpense() {
    return BuildingExpense.findByPk(this.params.buildingExpenseId)
  }

  private buildPolicy(buildingExpense: BuildingExpense = BuildingExpense.build()) {
    return new BuildingExpensePolicy(this.currentUser, buildingExpense)
  }
}

export default BuildingExpensesController
