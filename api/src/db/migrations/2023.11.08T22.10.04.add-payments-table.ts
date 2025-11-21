import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("payments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "centres",
        key: "id",
      },
    },
    fiscal_year: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    paid_on: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount_in_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("payments")
}
