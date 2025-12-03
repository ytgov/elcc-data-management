import { DataTypes, QueryTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-drop-constraint"

export async function up({ context: queryInterface }: Migration) {
  await removeConstraint(queryInterface, "fiscal_periods", {
    fields: ["fiscal_year", "month"],
    type: "UNIQUE",
  })

  await queryInterface.addColumn("fiscal_periods", "funding_period_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
  })

  await queryInterface.sequelize.query(/* sql */ `
    WITH
      fiscal_year_transformations AS (
        SELECT DISTINCT
          SUBSTRING(fiscal_periods.fiscal_year, 1, 4) + '-' + CAST(
            (
              CAST(
                SUBSTRING(fiscal_periods.fiscal_year, 6, 2) AS INT
              ) + 2000
            ) AS VARCHAR
          ) as long_fiscal_year,
          MIN(fiscal_periods.date_start) as from_date,
          MAX(fiscal_periods.date_end) as to_date
        FROM
          fiscal_periods
        GROUP BY
          SUBSTRING(fiscal_periods.fiscal_year, 1, 4) + '-' + CAST(
            (
              CAST(
                SUBSTRING(fiscal_periods.fiscal_year, 6, 2) AS INT
              ) + 2000
            ) AS VARCHAR
          )
      )
    INSERT INTO
      funding_periods (
        fiscal_year,
        from_date,
        to_date,
        title,
        created_at,
        updated_at
      )
    SELECT
      long_fiscal_year,
      from_date,
      to_date,
      'Fiscal Year ' + long_fiscal_year,
      GETUTCDATE(),
      GETUTCDATE()
    FROM
      fiscal_year_transformations
    WHERE
      long_fiscal_year NOT IN (
        SELECT
          fiscal_year
        FROM
          funding_periods
      )
  `)

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
      fiscal_year_mappings.long_fiscal_year = SUBSTRING(fiscal_periods.fiscal_year, 1, 4) + '-' + CAST(
        (
          CAST(
            SUBSTRING(fiscal_periods.fiscal_year, 6, 2) AS INT
          ) + 2000
        ) AS VARCHAR
      )
  `)

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
    throw new Error(`Failed to link ${unlinkedPeriodCount} fiscal periods to funding periods`)
  }

  await queryInterface.changeColumn("fiscal_periods", "funding_period_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      table: "funding_periods",
      key: "id",
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

export async function down({ context: queryInterface }: Migration) {
  await removeConstraint(queryInterface, "fiscal_periods", {
    fields: ["funding_period_id", "fiscal_year", "month"],
    type: "UNIQUE",
  })

  await queryInterface.removeColumn("fiscal_periods", "funding_period_id")

  await queryInterface.addConstraint("fiscal_periods", {
    fields: ["fiscal_year", "month"],
    type: "UNIQUE",
    name: "fiscal_periods_fiscal_year_month_unique",
  })
}
