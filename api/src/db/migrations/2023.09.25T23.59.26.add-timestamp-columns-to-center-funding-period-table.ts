import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("centre_funding_period", "created_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.addColumn("centre_funding_period", "updated_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("centre_funding_period", "created_at")
  await queryInterface.removeColumn("centre_funding_period", "updated_at")
}
