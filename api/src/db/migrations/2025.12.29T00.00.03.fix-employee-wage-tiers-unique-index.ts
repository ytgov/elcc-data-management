import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex(
    "employee_wage_tiers",
    "unique_employee_wage_tiers_on_fiscal_period_id_tier_level"
  )

  await queryInterface.addIndex("employee_wage_tiers", ["fiscal_period_id", "tier_level"], {
    name: "employee_wage_tiers_on_fiscal_period_id_tier_level_unique",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex(
    "employee_wage_tiers",
    "employee_wage_tiers_on_fiscal_period_id_tier_level_unique"
  )

  await queryInterface.addIndex("employee_wage_tiers", ["fiscal_period_id", "tier_level"], {
    name: "unique_employee_wage_tiers_on_fiscal_period_id_tier_level",
    unique: true,
  })
}
