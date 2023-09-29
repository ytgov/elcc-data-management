import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameTable("centre_funding_period", "centre_funding_periods")
  await queryInterface.renameTable("funding_period", "funding_periods")
  await queryInterface.renameTable("funding_submission_line_json", "funding_submission_line_jsons")
  await queryInterface.renameTable(
    "funding_submission_line_value",
    "funding_submission_line_values"
  )
  await queryInterface.renameTable("funding_submission_line", "funding_submission_lines")
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameTable("centre_funding_periods", "centre_funding_period")
  await queryInterface.renameTable("funding_periods", "funding_period")
  await queryInterface.renameTable("funding_submission_line_jsons", "funding_submission_line_json")
  await queryInterface.renameTable(
    "funding_submission_line_values",
    "funding_submission_line_value"
  )
  await queryInterface.renameTable("funding_submission_lines", "funding_submission_line")
}
