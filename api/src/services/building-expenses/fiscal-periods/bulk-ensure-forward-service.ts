import { Op } from "@sequelize/core"
import { pick } from "lodash"

import { BuildingExpense, FiscalPeriod, User } from "@/models"
import BaseService from "@/services/base-service"
import CreateService, {
  type BuildingExpenseCreationAttributes,
} from "@/services/building-expenses/create-service"

export class BulkEnsureForwardService extends BaseService {
  constructor(
    private fiscalPeriod: FiscalPeriod,
    private buildingExpense: BuildingExpense,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    const { centreId, categoryId } = this.buildingExpense
    const buildingExpenseAttributes = this.extractBuildingExpenseAttributes(this.buildingExpense)

    const { dateStart } = this.fiscalPeriod
    await FiscalPeriod.findEach(
      {
        attributes: ["id"],
        order: [["dateStart", "ASC"]],
        where: {
          dateStart: {
            [Op.gt]: dateStart,
          },
        },
      },
      async (futureFiscalPeriod) => {
        const existingBuildingExpense = await BuildingExpense.findOne({
          attributes: ["id"],
          where: {
            centreId,
            categoryId,
            fiscalPeriodId: futureFiscalPeriod.id,
          },
        })

        if (existingBuildingExpense) return

        await CreateService.perform(
          {
            ...buildingExpenseAttributes,
            fiscalPeriodId: futureFiscalPeriod.id,
          },
          this.currentUser
        )
      }
    )
  }

  private extractBuildingExpenseAttributes(
    buildingExpense: BuildingExpense
  ): Partial<BuildingExpenseCreationAttributes> {
    return pick(buildingExpense, [
      "centreId",
      "categoryId",
      "fundingRegionSnapshot",
      "subsidyRate",
      "buildingUsagePercent",
      "estimatedCost",
      "actualCost",
      "totalCost",
      "notes",
    ])
  }
}

export default BulkEnsureForwardService
