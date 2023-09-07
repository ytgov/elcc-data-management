import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlDataTypes } from "@/db/mssql-data-types"

export const up: Migration = async ({ context: queryInterface }) => {
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
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: MssqlDataTypes.NOW,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("centres")
}
