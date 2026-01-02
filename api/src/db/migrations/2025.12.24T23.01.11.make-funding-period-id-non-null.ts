import { QueryTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-remove-constraint"

export async function up({ context: queryInterface }: Migration) {
  const fiscalPeriodsWithoutFundingPeriod = await queryInterface.sequelize.query<{
    count: string
  }>(
    /* sql */ `
      SELECT
        COUNT(*) as count
      FROM
        fiscal_periods
      WHERE
        funding_period_id IS NULL
    `,
    { type: QueryTypes.SELECT }
  )

  const unlinkedPeriodCount = parseInt(fiscalPeriodsWithoutFundingPeriod[0].count)
  if (unlinkedPeriodCount > 0) {
    // Backfill null funding_period_id values by matching fiscal years
    await queryInterface.sequelize.query(/* sql */ `
      WITH
        fiscal_year_mappings AS (
          SELECT
            funding_periods.id as funding_period_id,
            funding_periods.fiscal_year as long_fiscal_year
          FROM
            funding_periods
        )
      UPDATE fiscal_periods
      SET
        funding_period_id = fiscal_year_mappings.funding_period_id
      FROM
        fiscal_year_mappings
      WHERE
        fiscal_periods.funding_period_id IS NULL
        AND fiscal_year_mappings.long_fiscal_year = SUBSTRING(fiscal_periods.fiscal_year, 1, 4) + '-' + CAST(
          (
            CAST(
              SUBSTRING(fiscal_periods.fiscal_year, 6, 2) AS INT
            ) + 2000
          ) AS VARCHAR
        )
    `)

    // Verify all periods have been linked
    const remainingNulls = await queryInterface.sequelize.query<{
      count: string
    }>(
      /* sql */ `
        SELECT
          COUNT(*) as count
        FROM
          fiscal_periods
        WHERE
          funding_period_id IS NULL
      `,
      { type: QueryTypes.SELECT }
    )

    const remainingCount = parseInt(remainingNulls[0].count)
    if (remainingCount > 0) {
      throw new Error(
        `Failed to backfill ${remainingCount} fiscal periods - no matching funding period found`
      )
    }
  }

  // Drop constraints before making column nullable
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "FOREIGN KEY",
    fields: ["funding_period_id"],
  })
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "UNIQUE",
    fields: ["funding_period_id", "fiscal_year", "month"],
  })

  // Make the column non-null using raw SQL because Sequelize changeColumn isn't working
  await queryInterface.sequelize.query(/* sql */ `
    ALTER TABLE fiscal_periods
    ALTER COLUMN funding_period_id INT NOT NULL
  `)

  await queryInterface.addConstraint("fiscal_periods", {
    fields: ["funding_period_id"],
    type: "FOREIGN KEY",
    references: {
      table: "funding_periods",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })

  await queryInterface.addIndex("fiscal_periods", ["funding_period_id", "fiscal_year", "month"], {
    name: "fiscal_periods_funding_period_id_fiscal_year_month_unique",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  // Drop constraints before making column nullable
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "FOREIGN KEY",
    fields: ["funding_period_id"],
  })
  await queryInterface.removeIndex(
    "fiscal_periods",
    "fiscal_periods_funding_period_id_fiscal_year_month_unique"
  )

  // Make the column non-null using raw SQL because Sequelize changeColumn isn't working
  await queryInterface.sequelize.query(/* sql */ `
    ALTER TABLE fiscal_periods
    ALTER COLUMN funding_period_id INT NULL
  `)

  await queryInterface.addConstraint("fiscal_periods", {
    fields: ["funding_period_id"],
    type: "FOREIGN KEY",
    references: {
      table: "funding_periods",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  await queryInterface.addConstraint("fiscal_periods", {
    fields: ["funding_period_id", "fiscal_year", "month"],
    type: "UNIQUE",
    name: "fiscal_periods_funding_period_id_fiscal_year_month_unique",
  })
}
