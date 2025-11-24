import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("centre_funding_periods")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.createTable("centre_funding_periods", {
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
        table: "centres",
        key: "id",
      },
    },
    fiscal_period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("GETDATE"),
    },
    updated_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("GETDATE"),
    },
  })
}
