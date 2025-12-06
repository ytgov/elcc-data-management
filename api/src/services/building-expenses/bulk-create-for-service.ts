import { type CreationAttributes } from "@sequelize/core"

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

    const buildingExpenseCategories = await BuildingExpenseCategory.findAll()

    let buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      for (const fiscalPeriod of fiscalPeriods) {
        for (const category of buildingExpenseCategories) {
          buildingExpensesAttributes.push({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            buildingExpenseCategoryId: category.id,
            subsidyRate: category.subsidyRate,
            buildingUsagePercent: "0",
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
