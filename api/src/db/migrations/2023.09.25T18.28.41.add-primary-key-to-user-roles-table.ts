import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("user_roles", "id", {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("user_roles", "id")
}
