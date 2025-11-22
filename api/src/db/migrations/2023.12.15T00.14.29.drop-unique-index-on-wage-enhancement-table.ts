import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex(
    "wage_enhancements",
    "unique_wage_enhancements_on_centre_id_employee_wage_tier_id"
  )
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.addIndex("wage_enhancements", {
    fields: ["centre_id", "employee_wage_tier_id"],
    unique: true,
    name: "unique_wage_enhancements_on_centre_id_employee_wage_tier_id",
  })
}
