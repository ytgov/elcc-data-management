import { isNil } from "lodash"

import logger from "@/utils/logger"
import { BuildingExpenseCategory } from "@/models"
import { BuildingExpenseCategoryPolicy } from "@/policies"
import {
  CreateService,
  DestroyService,
  UpdateService,
} from "@/services/building-expense-categories"
import { IndexSerializer, ShowSerializer } from "@/serializers/building-expense-categories"
import BaseController from "@/controllers/base-controller"

export class BuildingExpenseCategoriesController extends BaseController<BuildingExpenseCategory> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([
        ["fundingRegion", "region", "ASC"],
        ["categoryName", "ASC"],
      ])
      const scopedBuildingExpenseCategories = BuildingExpenseCategoryPolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedBuildingExpenseCategories.count({ where })
      const buildingExpenseCategories = await scopedBuildingExpenseCategories.findAll({
        where,
        include: ["fundingRegion"],
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedBuildingExpenseCategories = IndexSerializer.perform(buildingExpenseCategories)
      return this.response.json({
        buildingExpenseCategories: serializedBuildingExpenseCategories,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching building expense categories: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching building expense categories: ${error}`,
      })
    }
  }

  async show() {
    try {
      const buildingExpenseCategory = await this.loadBuildingExpenseCategory()
      if (isNil(buildingExpenseCategory)) {
        return this.response.status(404).json({
          message: "Building expense category not found",
        })
      }

      const policy = this.buildPolicy(buildingExpenseCategory)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this building expense category",
        })
      }

      const serializedBuildingExpenseCategory = ShowSerializer.perform(buildingExpenseCategory)
      return this.response.json({
        buildingExpenseCategory: serializedBuildingExpenseCategory,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching building expense category: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching building expense category: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create building expense categories",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const buildingExpenseCategory = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )
      const serializedBuildingExpenseCategory = ShowSerializer.perform(buildingExpenseCategory)
      return this.response.status(201).json({
        buildingExpenseCategory: serializedBuildingExpenseCategory,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating building expense category: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating building expense category: ${error}`,
      })
    }
  }

  async update() {
    try {
      const buildingExpenseCategory = await this.loadBuildingExpenseCategory()
      if (isNil(buildingExpenseCategory)) {
        return this.response.status(404).json({
          message: "Building expense category not found",
        })
      }

      const policy = this.buildPolicy(buildingExpenseCategory)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this building expense category",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedBuildingExpenseCategory = await UpdateService.perform(
        buildingExpenseCategory,
        permittedAttributes,
        this.currentUser
      )
      const serializedBuildingExpenseCategory = ShowSerializer.perform(
        updatedBuildingExpenseCategory
      )
      return this.response.json({
        buildingExpenseCategory: serializedBuildingExpenseCategory,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating building expense category: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating building expense category: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const buildingExpenseCategory = await this.loadBuildingExpenseCategory()
      if (isNil(buildingExpenseCategory)) {
        return this.response.status(404).json({
          message: "Building expense category not found",
        })
      }

      const policy = this.buildPolicy(buildingExpenseCategory)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this building expense category",
        })
      }

      await DestroyService.perform(buildingExpenseCategory, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting building expense category: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting building expense category: ${error}`,
      })
    }
  }

  private loadBuildingExpenseCategory() {
    return BuildingExpenseCategory.findByPk(this.params.buildingExpenseCategoryId)
  }

  private buildPolicy(
    buildingExpenseCategory: BuildingExpenseCategory = BuildingExpenseCategory.build()
  ) {
    return new BuildingExpenseCategoryPolicy(this.currentUser, buildingExpenseCategory)
  }
}

export default BuildingExpenseCategoriesController
