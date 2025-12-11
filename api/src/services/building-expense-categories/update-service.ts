import { Attributes } from "@sequelize/core"

import { BuildingExpenseCategory, User } from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseCategoryUpdateAttributes = Partial<Attributes<BuildingExpenseCategory>>

export class UpdateService extends BaseService {
  constructor(
    private buildingExpenseCategory: BuildingExpenseCategory,
    private attributes: BuildingExpenseCategoryUpdateAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpenseCategory> {
    await this.buildingExpenseCategory.update(this.attributes)

    return this.buildingExpenseCategory
  }
}

export default UpdateService
