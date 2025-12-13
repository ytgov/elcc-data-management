import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  // Fix incorrect fiscal period assignments from the 2025.10.04 migration
  // Root cause: The original migration compared DATEONLY (paid_on) to datetime2 (date_start/date_end)
  // without proper type casting, and used exclusive end boundary (< date_end) instead of inclusive (<=)
  // This caused payments on the 1st of each month to be assigned to the previous month's fiscal period
  //
  // This migration corrects all fiscal_period_id values by:
  // 1. Casting both paid_on and fiscal period dates to DATE type for consistent comparison
  // 2. Using inclusive end boundary (<= date_end) to match application logic
  // 3. Using CROSS APPLY with ORDER BY to ensure deterministic matching
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE payments
    SET
      fiscal_period_id = matched_fiscal_periods.id
    FROM
      payments
      CROSS APPLY (
        SELECT
          TOP 1 fiscal_periods.id
        FROM
          fiscal_periods
        WHERE
          CAST(payments.paid_on AS date) >= CAST(fiscal_periods.date_start AS date)
          AND CAST(payments.paid_on AS date) <= CAST(fiscal_periods.date_end AS date)
        ORDER BY
          fiscal_periods.date_start ASC
      ) AS matched_fiscal_periods
  `)
}

export async function down({ context: _queryInterface }: Migration) {
  // This migration is idempotent and corrects data errors.
  // I am choosing not to support rolling back to bad data.
}
