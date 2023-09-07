import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlDataTypes } from "@/db/mssql-data-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users", {
    email: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    sub: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ynet_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    directory_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Might need to changes this an use literals?
    // type: datetime2(0), default: GETDATE()
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: MssqlDataTypes.NOW,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users")
}
