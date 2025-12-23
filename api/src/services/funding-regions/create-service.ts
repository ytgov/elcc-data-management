import { type CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import db, { BuildingExpenseCategory, FundingRegion, User } from "@/models"
import BaseService from "@/services/base-service"

export type FundingRegionCreationAttributes = Partial<CreationAttributes<FundingRegion>>

export class CreateService extends BaseService {
  constructor(
    private attributes: FundingRegionCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FundingRegion> {
    const { region, subsidyRate } = this.attributes

    if (isNil(region)) {
      throw new Error("Region is required")
    }

    if (isNil(subsidyRate)) {
      throw new Error("Subsidy rate is required")
    }

    return db.transaction(async () => {
      const fundingRegion = await FundingRegion.create({
        region,
        subsidyRate,
      })

      await this.copyBuildingExpenseCategoriesFromExisting(fundingRegion)

      return fundingRegion
    })
  }

  private async copyBuildingExpenseCategoriesFromExisting(
    newFundingRegion: FundingRegion
  ): Promise<void> {
    const existingFundingRegion = await FundingRegion.findOne({
      order: [["id", "ASC"]],
    })
    if (isNil(existingFundingRegion)) return

    const existingCategories = await BuildingExpenseCategory.findAll({
      where: {
        fundingRegionId: existingFundingRegion.id,
      },
    })
    if (isEmpty(existingCategories)) return

    const newCategoriesAttributes = existingCategories.map((category) => ({
      fundingRegionId: newFundingRegion.id,
      categoryName: category.categoryName,
      subsidyRate: category.subsidyRate,
    }))

    await BuildingExpenseCategory.bulkCreate(newCategoriesAttributes)
  }
}

export default CreateService
