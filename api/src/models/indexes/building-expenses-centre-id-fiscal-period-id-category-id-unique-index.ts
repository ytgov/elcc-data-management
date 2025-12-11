import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex = createIndexDecorator(
  "building-expenses-centre-id-fiscal-period-id-category-id-unique",
  {
    unique: true,
    name: "unique_building_expenses_on_centre_id_fiscal_period_id_category_id",
    where: {
      deletedAt: null,
    },
    msg: "A building expense for this category already exists for this centre and fiscal period",
  }
)

export default BuildingExpensesCentreIdFiscalPeriodIdCategoryIdUniqueIndex
