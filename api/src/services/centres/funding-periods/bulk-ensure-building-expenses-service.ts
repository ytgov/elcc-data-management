import { BuildingExpense, Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateBuildingExpensesService from "@/services/centres/funding-periods/bulk-create-building-expenses-service"

export class BulkEnsureBuildingExpensesService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<void> {
    const buildingExpenseCount = await BuildingExpense.count({
      where: {
        centreId: this.centre.id,
      },
    })
    if (buildingExpenseCount > 0) return

    await BulkCreateBuildingExpensesService.perform(this.centre, this.fundingPeriod)
  }
}

export default BulkEnsureBuildingExpensesService
