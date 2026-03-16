import { Op, type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingRegion,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkEnsureForwardService extends BaseService {
  constructor(private buildingExpenseCategory: BuildingExpenseCategory) {
    super()
  }

  async perform(): Promise<void> {
    const {
      id: buildingExpenseCategoryId,
      fundingRegionId,
      subsidyRate,
    } = this.buildingExpenseCategory
    const fundingRegion = await FundingRegion.findByPk(fundingRegionId, {
      attributes: ["region"],
      rejectOnEmpty: true,
    })
    const { region: fundingRegionSnapshot } = fundingRegion

    const currentMonthStart = DateTime.now().startOf("month").toJSDate()
    await FiscalPeriod.findEach(
      {
        where: {
          dateEnd: {
            [Op.gte]: currentMonthStart,
          },
        },
      },
      async (fiscalPeriod) => {
        await this.ensureBuildingExpensesForFiscalPeriod(
          fiscalPeriod,
          buildingExpenseCategoryId,
          fundingRegionId,
          subsidyRate,
          fundingRegionSnapshot
        )
      }
    )
  }

  private async ensureBuildingExpensesForFiscalPeriod(
    fiscalPeriod: FiscalPeriod,
    buildingExpenseCategoryId: number,
    fundingRegionId: number,
    subsidyRate: string,
    fundingRegionSnapshot: string
  ): Promise<void> {
    let buildingExpensesAttributes: Array<CreationAttributes<BuildingExpense>> = []

    await Centre.findEach(
      {
        where: {
          fundingRegionId,
        },
      },
      async (centre) => {
        buildingExpensesAttributes.push({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          categoryId: buildingExpenseCategoryId,
          fundingRegionSnapshot,
          subsidyRate,
          buildingUsagePercent: centre.buildingUsagePercent,
          estimatedCost: "0",
          actualCost: "0",
          totalCost: "0",
        })

        if (buildingExpensesAttributes.length === 1000) {
          await BuildingExpense.bulkCreate(buildingExpensesAttributes)

          buildingExpensesAttributes = []
        }
      }
    )

    if (buildingExpensesAttributes.length > 0) {
      await BuildingExpense.bulkCreate(buildingExpensesAttributes)
    }
  }
}

export default BulkEnsureForwardService
