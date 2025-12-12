import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const BuildingExpenseCategoriesFundingRegionIdCategoryNameUniqueIndex =
  createIndexDecorator("building-expense-categories-funding-region-id-category-name-unique", {
    unique: true,
    name: "unique_building_expense_categories_on_funding_region_id_category_name",
    where: {
      deletedAt: null,
    },
    msg: "A building expense category with this name already exists for this funding region",
  })

export default BuildingExpenseCategoriesFundingRegionIdCategoryNameUniqueIndex
