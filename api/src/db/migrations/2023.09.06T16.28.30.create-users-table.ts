import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
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
    create_date: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("users")
}
