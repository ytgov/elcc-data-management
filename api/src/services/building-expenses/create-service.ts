import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { BuildingExpense, BuildingExpenseCategory, Centre, FundingRegion, User } from "@/models"
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
      buildingExpenseCategoryId,
      estimatedCost,
      actualCost,
      totalCost,
      ...optionalAttributes
    } = this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    if (isNil(buildingExpenseCategoryId)) {
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

    const fundingRegionSnapshot = await this.determineFundingRegion(buildingExpenseCategoryId)
    const buildingUsagePercent = await this.determineBuildingUsagePercent(centreId)
    const subsidyRate = await this.determineSubsidyRate(buildingExpenseCategoryId)

    const buildingExpense = await BuildingExpense.create({
      ...optionalAttributes,
      centreId,
      fiscalPeriodId,
      buildingExpenseCategoryId,
      fundingRegionSnapshot,
      subsidyRate,
      buildingUsagePercent,
      estimatedCost,
      actualCost,
      totalCost,
    })

    return buildingExpense
  }

  private async determineFundingRegion(buildingExpenseCategoryId: number): Promise<string> {
    const fundingRegion = await FundingRegion.findOne({
      attributes: ["region"],
      include: [
        {
          association: "buildingExpenseCategories",
          where: {
            id: buildingExpenseCategoryId,
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

  private async determineSubsidyRate(buildingExpenseCategoryId: number): Promise<string> {
    const category = await BuildingExpenseCategory.findByPk(buildingExpenseCategoryId, {
      attributes: ["subsidyRate"],
      rejectOnEmpty: true,
    })
    const { subsidyRate } = category
    return subsidyRate
  }
}

export default CreateService
