import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addIndex("employee_benefits", {
    fields: ["centre_id", "fiscal_period_id"],
    unique: true,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex("employee_benefits", ["centre_id", "fiscal_period_id"])
}
