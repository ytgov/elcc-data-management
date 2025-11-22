import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
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
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
    updated_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("users")
}
