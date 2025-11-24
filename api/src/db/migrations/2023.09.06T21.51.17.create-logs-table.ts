import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
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
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("logs")
}
