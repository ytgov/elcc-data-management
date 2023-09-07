import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("funding_submission_line_json", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "centres",
        key: "id",
      },
    },
    fiscal_year: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    date_name: {
      type: DataTypes.STRING(100),
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
    values: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("funding_submission_line_json")
}
