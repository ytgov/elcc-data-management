import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { BuildingExpenseCategory, User } from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseCategoryCreationAttributes = Partial<
  CreationAttributes<BuildingExpenseCategory>
>

export class CreateService extends BaseService {
  constructor(
    private attributes: BuildingExpenseCategoryCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpenseCategory> {
    const { fundingRegionId, categoryName, subsidyRate, ...optionalAttributes } = this.attributes

    if (isNil(fundingRegionId)) {
      throw new Error("Funding region ID is required")
    }

    if (isNil(categoryName)) {
      throw new Error("Category name is required")
    }

    if (isNil(subsidyRate)) {
      throw new Error("Subsidy rate is required")
    }

    const buildingExpenseCategory = await BuildingExpenseCategory.create({
      ...optionalAttributes,
      fundingRegionId,
      categoryName,
      subsidyRate,
    })

    return buildingExpenseCategory
  }
}

export default CreateService
