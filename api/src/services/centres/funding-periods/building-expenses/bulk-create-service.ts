import { type CreationAttributes } from "@sequelize/core"
import { isEmpty, isUndefined } from "lodash"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingPeriod,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense[]> {
    const fiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (isEmpty(fiscalPeriods)) {
      throw new Error("No fiscal periods found for funding period.")
    }

    const { fundingRegionId } = this.centre
    const buildingExpenseCategories = await BuildingExpenseCategory.findAll({
      where: {
        fundingRegionId,
      },
      include: ["fundingRegion"],
    })
    if (isEmpty(buildingExpenseCategories)) {
      throw new Error("No building expense categories found for the centre's funding region.")
    }

    const { buildingUsagePercent } = this.centre

    const buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = fiscalPeriods.flatMap(
      (fiscalperiod) => {
        return buildingExpenseCategories.map((buildingExpenseCategory) => {
          const { subsidyRate, fundingRegion } = buildingExpenseCategory
          if (isUndefined(fundingRegion)) {
            throw new Error("Expected fundingRegion association to be pre-loaded")
          }

          const { region: fundingRegionSnapshot } = fundingRegion

          return {
            centreId: this.centre.id,
            fiscalPeriodId: fiscalperiod.id,
            buildingExpenseCategoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot,
            subsidyRate,
            buildingUsagePercent,
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }
        })
      }
    )

    return BuildingExpense.bulkCreate(buildingExpensesAttributes)
  }
}

export default BulkCreateService
