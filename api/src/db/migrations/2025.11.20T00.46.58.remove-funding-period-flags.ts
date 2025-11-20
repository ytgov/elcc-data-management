import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("funding_periods", "is_fiscal_year")
  await queryInterface.removeColumn("funding_periods", "is_school_month")
}

export const down: Migration = async ({ context: queryInterface }) => {
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
