import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex("fiscal_periods", "fiscal_periods_fiscal_year_month_unique")

  await queryInterface.addIndex("fiscal_periods", ["fiscal_year", "month"], {
    name: "fiscal_periods_fiscal_year_month_unique",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex("fiscal_periods", "fiscal_periods_fiscal_year_month_unique")

  await queryInterface.addIndex("fiscal_periods", ["fiscal_year", "month"], {
    name: "fiscal_periods_fiscal_year_month_unique",
    unique: true,
  })
}
