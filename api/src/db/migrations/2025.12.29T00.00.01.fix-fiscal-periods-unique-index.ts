import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  try {
    await queryInterface.removeIndex("fiscal_periods", "fiscal_periods_fiscal_year_month_unique")
  } catch (error) {
    console.debug(
      `Aligning production and development environments: fiscal_periods_fiscal_year_month_unique index does not exist: ${error}`,
      { error }
    )
  }

  try {
    await queryInterface.removeIndex("fiscal_periods", "fiscal_periods_fiscal_year_month")
  } catch (error) {
    console.debug(
      `Aligning production and development environments: fiscal_periods_fiscal_year_month index does not exist: ${error}`,
      { error }
    )
  }

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

  // Delete duplicate fiscal_period records and their dependent records,
  // keeping only the one with the smallest id for each fiscal_year/month pair
  await queryInterface.sequelize.query(/* sql */ `
    DELETE FROM building_expenses
    WHERE
      fiscal_period_id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );

    DELETE FROM employee_benefits
    WHERE
      fiscal_period_id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );

    DELETE FROM employee_wage_tiers
    WHERE
      fiscal_period_id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );

    DELETE FROM funding_reconciliation_adjustments
    WHERE
      fiscal_period_id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );

    DELETE FROM payments
    WHERE
      fiscal_period_id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );

    DELETE FROM fiscal_periods
    WHERE
      id NOT IN (
        SELECT
          MIN(id)
        FROM
          fiscal_periods
        GROUP BY
          fiscal_year,
          month
      );
  `)

  await queryInterface.addIndex("fiscal_periods", ["fiscal_year", "month"], {
    name: "fiscal_periods_fiscal_year_month_unique",
    unique: true,
  })
}
