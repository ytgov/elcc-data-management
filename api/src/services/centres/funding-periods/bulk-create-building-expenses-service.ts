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

export class BulkCreateBuildingExpensesService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<void> {
    const { fundingRegion } = this.centre
    if (isUndefined(fundingRegion)) {
      throw new Error("Expected fundingRegion association to be pre-loaded.")
    }

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

    let buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = []
    const { buildingUsagePercent } = this.centre
    const BATCH_SIZE = 1000

    for (const fiscalPeriod of fiscalPeriods) {
      for (const buildingExpenseCategory of buildingExpenseCategories) {
        const { subsidyRate, fundingRegion } = buildingExpenseCategory
        if (isUndefined(fundingRegion)) {
          throw new Error("Expected fundingRegion association to be pre-loaded")
        }

        const { region: fundingRegionSnapshot } = fundingRegion

        buildingExpensesAttributes.push({
          centreId: this.centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          buildingExpenseCategoryId: buildingExpenseCategory.id,
          fundingRegionSnapshot: fundingRegionSnapshot,
          subsidyRate,
          buildingUsagePercent,
          estimatedCost: "0",
          actualCost: "0",
          totalCost: "0",
        })

        if (buildingExpensesAttributes.length >= BATCH_SIZE) {
          await BuildingExpense.bulkCreate(buildingExpensesAttributes)
          buildingExpensesAttributes = []
        }
      }
    }

    if (buildingExpensesAttributes.length > 0) {
      await BuildingExpense.bulkCreate(buildingExpensesAttributes)
    }
  }
}

export default BulkCreateBuildingExpensesService
