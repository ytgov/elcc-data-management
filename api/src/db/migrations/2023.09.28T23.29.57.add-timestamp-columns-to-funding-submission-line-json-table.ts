import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("funding_submission_line_json", "created_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.addColumn("funding_submission_line_json", "updated_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("funding_submission_line_json", "created_at")
  await queryInterface.removeColumn("funding_submission_line_json", "updated_at")
}
