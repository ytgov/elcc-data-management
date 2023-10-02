import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("centre_funding_periods", "centreId", "centre_id")
  await queryInterface.renameColumn("centre_funding_periods", "fiscalPeriodId", "fiscal_period_id")
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn("centre_funding_periods", "centre_id", "centreId")
  await queryInterface.renameColumn("centre_funding_periods", "fiscal_period_id", "fiscalPeriodId")
}
