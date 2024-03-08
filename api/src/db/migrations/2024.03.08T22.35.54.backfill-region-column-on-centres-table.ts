import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"

import { Centre } from "@/models"

export const up: Migration = async ({ context: queryInterface }) => {
  await Centre.update({ region: Centre.Regions.WHITEHORSE }, { where: { region: null } })

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
