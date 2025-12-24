import { isEmpty } from "lodash"

import { BuildingExpense, Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/centres/funding-periods/building-expenses/bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense[]> {
    const buildingExpenses = await BuildingExpense.findAll({
      where: {
        centreId: this.centre.id,
      },
    })
    if (!isEmpty(buildingExpenses)) return buildingExpenses

    return BulkCreateService.perform(this.centre, this.fundingPeriod)
  }
}

export default BulkEnsureService
