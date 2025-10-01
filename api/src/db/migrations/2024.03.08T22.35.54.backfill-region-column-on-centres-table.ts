import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
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

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })
}
