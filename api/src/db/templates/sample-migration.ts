import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  throw new Error("Not implemented")
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
    updatedAt: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  throw new Error("Not implemented")
  await queryInterface.dropTable("users")
}
