import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addIndex("fiscal_periods", {
    fields: ["fiscal_year", "month"],
    unique: true,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex("fiscal_periods", ["fiscal_year", "month"])
}
