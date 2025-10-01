import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("wage_enhancements", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "centres",
        key: "id",
      },
    },
    employee_wage_tier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employee_wage_tiers",
        key: "id",
      },
    },
    employee_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hours_estimated: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    hours_actual: {
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

  await queryInterface.addIndex("wage_enhancements", {
    fields: ["centre_id", "employee_wage_tier_id"],
    unique: true,
    name: "unique_wage_enhancements_on_centre_id_employee_wage_tier_id",
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex(
    "wage_enhancements",
    "unique_wage_enhancements_on_centre_id_employee_wage_tier_id"
  )

  await queryInterface.dropTable("wage_enhancements")
}
