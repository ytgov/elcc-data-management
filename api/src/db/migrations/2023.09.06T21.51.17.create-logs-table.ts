import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlDataTypes } from "@/db/mssql-data-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("logs", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: MssqlDataTypes.NOW,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("logs")
}
