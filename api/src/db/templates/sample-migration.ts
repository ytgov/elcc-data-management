import { DataTypes, type QueryInterface } from "@sequelize/core"

import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up(queryInterface: QueryInterface) {
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

export async function down(queryInterface: QueryInterface) {
  throw new Error("Not implemented")
  await queryInterface.dropTable("users")
}
