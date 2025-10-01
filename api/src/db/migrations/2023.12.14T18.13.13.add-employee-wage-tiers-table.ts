import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("employee_wage_tiers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fiscal_period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fiscal_periods",
        key: "id",
      },
    },
    tier_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tier_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    wage_rate_per_hour: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    created_at: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
    updated_at: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })

  await queryInterface.addIndex("employee_wage_tiers", {
    fields: ["fiscal_period_id", "tier_level"],
    unique: true,
    name: "unique_employee_wage_tiers_on_fiscal_period_id_tier_level",
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex(
    "employee_wage_tiers",
    "unique_employee_wage_tiers_on_fiscal_period_id_tier_level"
  )

  await queryInterface.dropTable("employee_wage_tiers")
}
