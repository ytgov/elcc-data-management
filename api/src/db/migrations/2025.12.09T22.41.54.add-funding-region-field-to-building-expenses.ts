import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("building_expenses", "funding_region_snapshot", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })

  await queryInterface.sequelize.query(/* sql */ `
    UPDATE building_expenses
    SET
      funding_region_snapshot = COALESCE(funding_regions.region, 'Whitehorse')
    FROM
      building_expenses
      LEFT JOIN building_expense_categories ON building_expenses.building_expense_category_id = building_expense_categories.id
      AND building_expense_categories.deleted_at IS NULL
      LEFT JOIN funding_regions ON building_expense_categories.funding_region_id = funding_regions.id
      AND funding_regions.deleted_at IS NULL
  `)

  await queryInterface.changeColumn("building_expenses", "funding_region_snapshot", {
    type: DataTypes.STRING(100),
    allowNull: false,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("building_expenses", "funding_region_snapshot")
}
