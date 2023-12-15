import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex(
    "wage_enhancements",
    "unique_wage_enhancements_on_centre_id_employee_wage_tier_id"
  )
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addIndex("wage_enhancements", {
    fields: ["centre_id", "employee_wage_tier_id"],
    unique: true,
    name: "unique_wage_enhancements_on_centre_id_employee_wage_tier_id",
  })
}
