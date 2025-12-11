import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("centres", "building_usage_percent", {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 100.00,
    allowNull: false,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("centres", "building_usage_percent")
}
