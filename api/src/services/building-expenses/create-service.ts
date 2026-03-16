import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingRegion,
  User,
} from "@/models"
import BaseService from "@/services/base-service"
import { FiscalPeriods } from "@/services/building-expenses"

export type BuildingExpenseCreationAttributes = Partial<CreationAttributes<BuildingExpense>> & {
  applyToCurrentAndFutureFiscalPeriods?: boolean
}

export class CreateService extends BaseService {
  constructor(
    private attributes: BuildingExpenseCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<BuildingExpense> {
    const {
      centreId,
      fiscalPeriodId,
      categoryId,
      estimatedCost,
      actualCost,
      totalCost,
      applyToCurrentAndFutureFiscalPeriods,
      ...optionalAttributes
    } = this.attributes

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    // TODO: should I just preload this in the controller?
    const fiscalPeriod = await this.loadFiscalPeriod(fiscalPeriodId)
    if (isNil(fiscalPeriod)) {
      throw new Error("Fiscal period not found")
    }

    await this.assertCurrentOrFutureFiscalPeriod(fiscalPeriod)

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(categoryId)) {
      throw new Error("Building expense category ID is required")
    }

    if (isNil(estimatedCost)) {
      throw new Error("Estimated cost is required")
    }

    if (isNil(actualCost)) {
      throw new Error("Actual cost is required")
    }

    if (isNil(totalCost)) {
      throw new Error("Total cost is required")
    }

    const fundingRegionSnapshot = await this.determineFundingRegion(categoryId)
    const buildingUsagePercent = await this.determineBuildingUsagePercent(centreId)
    const subsidyRate = await this.determineSubsidyRate(categoryId)

    return db.transaction(async () => {
      const buildingExpense = await BuildingExpense.create({
        ...optionalAttributes,
        centreId,
        fiscalPeriodId,
        categoryId,
        fundingRegionSnapshot,
        subsidyRate,
        buildingUsagePercent,
        estimatedCost,
        actualCost,
        totalCost,
      })

      if (applyToCurrentAndFutureFiscalPeriods) {
        await FiscalPeriods.BulkEnsureForwardService.perform(
          fiscalPeriod,
          buildingExpense,
          this.currentUser
        )
      }

      return buildingExpense
    })
  }

  private async loadFiscalPeriod(fiscalPeriodId: number): Promise<FiscalPeriod | null> {
    return FiscalPeriod.findByPk(fiscalPeriodId)
  }

  /**
   * TODO: make this timezone aware.
   * Probably will need to:
   * a) add timezone to Center
   * b) use that timezone to compare dates
   */
  private async assertCurrentOrFutureFiscalPeriod(fiscalPeriod: FiscalPeriod): Promise<void> {
    if (fiscalPeriod.dateEnd < new Date()) {
      throw new Error("Cannot create building expense for a past fiscal period")
    }
  }

  private async determineFundingRegion(categoryId: number): Promise<string> {
    const fundingRegion = await FundingRegion.findOne({
      attributes: ["region"],
      include: [
        {
          association: "buildingExpenseCategories",
          where: {
            id: categoryId,
          },
        },
      ],
      rejectOnEmpty: true,
    })
    const { region } = fundingRegion
    return region
  }

  private async determineBuildingUsagePercent(centreId: number): Promise<string> {
    const centre = await Centre.findByPk(centreId, {
      attributes: ["buildingUsagePercent"],
      rejectOnEmpty: true,
    })

    const { buildingUsagePercent } = centre
    return buildingUsagePercent
  }

  private async determineSubsidyRate(categoryId: number): Promise<string> {
    const category = await BuildingExpenseCategory.findByPk(categoryId, {
      attributes: ["subsidyRate"],
      rejectOnEmpty: true,
    })
    const { subsidyRate } = category
    return subsidyRate
  }
}

export default CreateService
