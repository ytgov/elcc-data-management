import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("centres", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    license: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    community: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hot_meal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    licensed_for: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_submission: {
      type: DataTypes.DATEONLY,
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
  await queryInterface.dropTable("centres")
}
