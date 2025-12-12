import { BuildingExpenseCategory, FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private fundingRegion: FundingRegion,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist()

    await this.fundingRegion.destroy()
  }

  private async assertNoDependentEntitiesExist() {
    await this.assertNoDependentBuildingExpenseCategoriesExist()
  }

  private async assertNoDependentBuildingExpenseCategoriesExist() {
    const buildingExpenseCategoryCount = await BuildingExpenseCategory.count({
      where: {
        fundingRegionId: this.fundingRegion.id,
      },
    })

    if (buildingExpenseCategoryCount > 0) {
      throw new Error("Funding region with building expense categories cannot be deleted")
    }
  }
}

export default DestroyService
