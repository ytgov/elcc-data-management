import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingRegion,
  User,
} from "@/models"
import BaseService from "@/services/base-service"

export type BuildingExpenseCreationAttributes = Partial<CreationAttributes<BuildingExpense>>

export class CreateService extends BaseService {
  constructor(
    private attributes: BuildingExpenseCreationAttributes,
    private _currentUser: User
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
      ...optionalAttributes
    } = this.attributes

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    // TODO: make this timezone aware.
    // Probably will need to: a) add timezone to Center and b) use that timezone to compare dates
    const fiscalPeriod = await FiscalPeriod.findByPk(fiscalPeriodId, {
      attributes: ["dateEnd"],
      rejectOnEmpty: true,
    })
    if (fiscalPeriod.dateEnd < new Date()) {
      throw new Error("Cannot create building expense for a past fiscal period")
    }

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

    return buildingExpense
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
