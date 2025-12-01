import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.changeColumn("wage_enhancements", "hours_estimated", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("wage_enhancements", "hours_actual", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.changeColumn("wage_enhancements", "hours_estimated", {
    type: DataTypes.FLOAT,
    allowNull: false,
  })

  await queryInterface.changeColumn("wage_enhancements", "hours_actual", {
    type: DataTypes.FLOAT,
    allowNull: false,
  })
}
