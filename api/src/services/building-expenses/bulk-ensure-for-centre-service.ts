import { BuildingExpense, Centre } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateForCentreService from "@/services/building-expenses/bulk-create-for-centre-service"

export class BulkEnsureForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const buildingExpenseCount = await BuildingExpense.count({
      where: {
        centreId: this.centre.id,
      },
    })
    if (buildingExpenseCount > 0) return

    await BulkCreateForCentreService.perform(this.centre)
  }
}

export default BulkEnsureForCentreService
