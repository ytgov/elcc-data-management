import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE centres
    SET region = 'whitehorse'
    WHERE region IS NULL
  `)

  await queryInterface.changeColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: false,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.changeColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
}
