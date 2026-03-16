import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { BuildingExpenseCategory, User } from "@/models"
import BaseService from "@/services/base-service"
import { BuildingExpenses } from "@/services/building-expense-categories"

export type BuildingExpenseCategoryCreationAttributes = Partial<
  CreationAttributes<BuildingExpenseCategory>
> & {
  applyToCurrentAndFutureCentreFundingPeriods?: boolean
}

export class CreateService extends BaseService {
  constructor(
    private attributes: BuildingExpenseCategoryCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpenseCategory> {
    const {
      fundingRegionId,
      categoryName,
      subsidyRate,
      applyToCurrentAndFutureCentreFundingPeriods,
      ...optionalAttributes
    } = this.attributes

    if (isNil(fundingRegionId)) {
      throw new Error("Funding region ID is required")
    }

    if (isNil(categoryName)) {
      throw new Error("Category name is required")
    }

    if (isNil(subsidyRate)) {
      throw new Error("Subsidy rate is required")
    }

    return db.transaction(async () => {
      const buildingExpenseCategory = await BuildingExpenseCategory.create({
        ...optionalAttributes,
        fundingRegionId,
        categoryName,
        subsidyRate,
      })

      if (applyToCurrentAndFutureCentreFundingPeriods) {
        await BuildingExpenses.BulkEnsureForwardService.perform(buildingExpenseCategory)
      }

      return buildingExpenseCategory
    })
  }
}

export default CreateService
