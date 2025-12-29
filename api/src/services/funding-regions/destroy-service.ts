import { BuildingExpenseCategory, Centre, FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private fundingRegion: FundingRegion,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.assertNoDependentEntitiesExist(this.fundingRegion.id)

    await this.fundingRegion.destroy()
  }

  private async assertNoDependentEntitiesExist(fundingRegionId: number) {
    await this.assertNoDependentBuildingExpenseCategoriesExist(fundingRegionId)
    await this.assertNoDependentCentresExist(fundingRegionId)
  }

  private async assertNoDependentBuildingExpenseCategoriesExist(fundingRegionId: number) {
    const buildingExpenseCategoryCount = await BuildingExpenseCategory.count({
      where: {
        fundingRegionId,
      },
    })

    if (buildingExpenseCategoryCount > 0) {
      throw new Error("Funding region with building expense categories cannot be deleted")
    }
  }

  private async assertNoDependentCentresExist(fundingRegionId: number) {
    const centresCount = await Centre.count({
      where: {
        fundingRegionId,
      },
    })

    if (centresCount > 0) {
      throw new Error("Funding region with centres cannot be deleted")
    }
  }
}

export default DestroyService
