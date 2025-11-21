import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("funding_periods", "is_fiscal_year")
  await queryInterface.removeColumn("funding_periods", "is_school_month")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("funding_periods", "is_fiscal_year", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  await queryInterface.addColumn("funding_periods", "is_school_month", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
}
