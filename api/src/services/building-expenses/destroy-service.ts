import { BuildingExpense, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private buildingExpense: BuildingExpense,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.buildingExpense.destroy()
  }
}

export default DestroyService
