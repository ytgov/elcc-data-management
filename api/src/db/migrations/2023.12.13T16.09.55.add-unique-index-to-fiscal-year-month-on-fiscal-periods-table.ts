import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addIndex("fiscal_periods", {
    fields: ["fiscal_year", "month"],
    unique: true,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex("fiscal_periods", ["fiscal_year", "month"])
}
