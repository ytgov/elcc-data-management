import { BuildingExpense, BuildingExpenseCategory, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private buildingExpenseCategory: BuildingExpenseCategory,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist()

    await this.buildingExpenseCategory.destroy()
  }

  private async assertNoDependentEntitiesExist() {
    await this.assertNoDependentBuildingExpensesExist()
  }

  private async assertNoDependentBuildingExpensesExist() {
    const buildingExpenseCount = await BuildingExpense.count({
      where: {
        buildingExpenseCategoryId: this.buildingExpenseCategory.id,
      },
    })

    if (buildingExpenseCount > 0) {
      throw new Error("Building expense category with building expenses cannot be deleted")
    }
  }
}

export default DestroyService
