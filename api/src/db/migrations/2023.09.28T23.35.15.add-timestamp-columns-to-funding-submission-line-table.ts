import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("funding_submission_line", "created_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.addColumn("funding_submission_line", "updated_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("funding_submission_line", "created_at")
  await queryInterface.removeColumn("funding_submission_line", "updated_at")
}
