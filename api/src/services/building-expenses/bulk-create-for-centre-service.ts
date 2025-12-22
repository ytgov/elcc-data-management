import { type CreationAttributes } from "@sequelize/core"
import { isUndefined } from "lodash"

import { BuildingExpense, BuildingExpenseCategory, Centre, FiscalPeriod } from "@/models"
import BaseService from "@/services/base-service"
import { FiscalPeriods, FundingPeriods } from "@/services"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const { fundingRegionId, buildingUsagePercent } = this.centre

    // TODO: ensure that there are some defaults for building expense categories?
    const buildingExpenseCategories = await BuildingExpenseCategory.findAll({
      include: [
        {
          association: "fundingRegion",
          where: {
            id: fundingRegionId,
          },
        },
      ],
    })

    const fiscalPeriods = await this.ensureFiscalPeriodsForCurrentFundingPeriod()

    let buildingExpensesAttributes: CreationAttributes<BuildingExpense>[] = []
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

  private async ensureFiscalPeriodsForCurrentFundingPeriod(): Promise<FiscalPeriod[]> {
    const fundingPeriod = await FundingPeriods.EnsureCurrentService.perform()
    return FiscalPeriods.BulkEnsureForFundingPeriodService.perform(fundingPeriod)
  }
}

export default BulkCreateForCentreService
