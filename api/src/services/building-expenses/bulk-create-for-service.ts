import { type CreationAttributes } from "@sequelize/core"
import { isUndefined } from "lodash"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingPeriod,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateForService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriodFiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    const buildingExpenseCategories = await BuildingExpenseCategory.findAll({
      include: ["fundingRegion"],
    })

    let buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      const { buildingUsagePercent } = centre

      for (const fiscalPeriod of fiscalPeriods) {
        for (const buildingExpenseCategory of buildingExpenseCategories) {
          const { subsidyRate, fundingRegion } = buildingExpenseCategory
          if (isUndefined(fundingRegion)) {
            throw new Error("Expected fundingRegion association to be pre-loaded")
          }

          const { region: fundingRegionSnapshot } = fundingRegion

          buildingExpensesAttributes.push({
            centreId: centre.id,
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
    })

    if (buildingExpensesAttributes.length > 0) {
      await BuildingExpense.bulkCreate(buildingExpensesAttributes)
    }
  }
}

export default BulkCreateForService
