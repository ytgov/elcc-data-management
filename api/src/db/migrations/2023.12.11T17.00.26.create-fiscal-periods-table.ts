import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("fiscal_periods", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fiscal_year: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    date_start: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
    },
    date_end: {
      type: MssqlSimpleTypes.DATETIME2(0),
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
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("fiscal_periods")
}
