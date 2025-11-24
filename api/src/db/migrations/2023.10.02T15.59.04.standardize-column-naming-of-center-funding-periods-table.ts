import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.renameColumn("centre_funding_periods", "centreId", "centre_id")
  await queryInterface.renameColumn("centre_funding_periods", "fiscalPeriodId", "fiscal_period_id")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.renameColumn("centre_funding_periods", "centre_id", "centreId")
  await queryInterface.renameColumn("centre_funding_periods", "fiscal_period_id", "fiscalPeriodId")
}
