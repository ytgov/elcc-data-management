import { Attributes } from "@sequelize/core"

import { BuildingExpense, User } from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseUpdateAttributes = Partial<Attributes<BuildingExpense>>

export class UpdateService extends BaseService {
  constructor(
    private buildingExpense: BuildingExpense,
    private attributes: BuildingExpenseUpdateAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense> {
    await this.buildingExpense.update(this.attributes)

    return this.buildingExpense
  }
}

export default UpdateService
