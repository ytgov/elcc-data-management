import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addIndex("employee_benefits", {
    fields: ["centre_id", "fiscal_period_id"],
    unique: true,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex("employee_benefits", ["centre_id", "fiscal_period_id"])
}
