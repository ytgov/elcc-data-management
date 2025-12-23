import { FundingRegion } from "@/models"
import BaseService from "@/services/base-service"
import { FundingRegions } from "@/services"

export class EnsureDependenciesService extends BaseService {
  constructor(private fundingRegion: FundingRegion) {
    super()
  }

  async perform(): Promise<void> {
    await FundingRegions.BuildingExpenseCategories.BulkEnsureService.perform(this.fundingRegion)
  }
}

export default EnsureDependenciesService
