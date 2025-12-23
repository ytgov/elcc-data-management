import { Op, sql } from "@sequelize/core"
import { isEmpty } from "lodash"

import { BuildingExpenseCategory, FundingRegion } from "@/models"
import { BUILDING_EXPENSE_CATEGORY_DEFAULTS } from "@/models/building-expense-category"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(private fundingRegion: FundingRegion) {
    super()
  }

  async perform(): Promise<BuildingExpenseCategory[]> {
    const { subsidyRate } = this.fundingRegion

    const buildingExpenseCategoryDefaults =
      await this.buildBuildingExpenseCategoryDefaults(subsidyRate)

    const buildingExpenseCategoriesAttributes = buildingExpenseCategoryDefaults.map((template) => ({
      fundingRegionId: this.fundingRegion.id,
      ...template,
    }))

    return BuildingExpenseCategory.bulkCreate(buildingExpenseCategoriesAttributes)
  }

  private async buildBuildingExpenseCategoryDefaults(subsidyRate: string) {
    const newestFundingRegionWithBuildingExpenseCategoriesQuery = sql`
      (
        SELECT
          TOP 1 building_expense_categories.funding_region_id
        FROM
          building_expense_categories
          INNER JOIN funding_regions ON funding_regions.id = building_expense_categories.funding_region_id
        ORDER BY
          funding_regions.created_at DESC,
          funding_regions.id DESC
      )
    `
    const newestBuildingExpenseCategories = await BuildingExpenseCategory.findAll({
      include: [
        {
          association: "fundingRegion",
          where: {
            id: {
              [Op.in]: newestFundingRegionWithBuildingExpenseCategoriesQuery,
            },
          },
        },
      ],
    })

    if (isEmpty(newestBuildingExpenseCategories)) {
      return BUILDING_EXPENSE_CATEGORY_DEFAULTS.map((categoryName) => ({
        categoryName,
        subsidyRate,
      }))
    }

    return newestBuildingExpenseCategories.map(({ categoryName }) => ({
      categoryName,
      subsidyRate,
    }))
  }
}

export default BulkCreateService
