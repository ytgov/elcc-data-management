import { isEmpty } from "lodash"

import { BuildingExpenseCategory, FundingRegion } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/funding-regions/building-expense-categories/bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(private fundingRegion: FundingRegion) {
    super()
  }

  async perform(): Promise<BuildingExpenseCategory[]> {
    const buildingExpenseCategories = await BuildingExpenseCategory.findAll({
      where: {
        fundingRegionId: this.fundingRegion.id,
      },
    })
    if (!isEmpty(buildingExpenseCategories)) return buildingExpenseCategories

    return BulkCreateService.perform(this.fundingRegion)
  }
}

export default BulkEnsureService
