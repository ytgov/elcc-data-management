import { QueryTypes, sql } from "@sequelize/core"
import Big from "big.js"
import { isNil } from "lodash"

import { type Migration } from "@/db/umzug"

export async function up({ context: { sequelize } }: Migration) {
  const BATCH_SIZE = 1000
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const fundingSubmissionLineJsons = await sequelize.query<{
      id: number
      centreId: number
      fiscalYearLegacy: string
      monthNameCapitalized: string
      values: string
    }>(
      sql`
        SELECT
          id,
          centre_id AS centreId,
          fiscal_year AS fiscalYearLegacy,
          date_name AS monthNameCapitalized,
          [values]
        FROM
          funding_submission_line_jsons
        ORDER BY
          id
        OFFSET
          :offset ROWS
        FETCH NEXT
          :batchSize ROWS ONLY
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          offset,
          batchSize: BATCH_SIZE,
        },
      }
    )

    if (fundingSubmissionLineJsons.length === 0) {
      hasMore = false
      break
    }

    for (const fundingSubmissionLineJson of fundingSubmissionLineJsons) {
      const lines: {
        sectionName: string
        lineName: string
        monthlyAmount: string
        estimatedCost?: string
        actualCost?: string
      }[] = JSON.parse(fundingSubmissionLineJson.values)
      const buildingExpenseLines = lines.filter((line) => line.sectionName === "Building Expenses")
      const otherLines = lines.filter((line) => line.sectionName !== "Building Expenses")

      if (buildingExpenseLines.length === 0) {
        continue
      }

      const monthNameLowercase = fundingSubmissionLineJson.monthNameCapitalized.toLowerCase()
      const fiscalYearShort = fundingSubmissionLineJson.fiscalYearLegacy.replace("/", "-")
      const [fiscalPeriod] = await sequelize.query<{
        id: number
      }>(
        sql`
          SELECT
            id
          FROM
            fiscal_periods
          WHERE
            fiscal_year = :fiscalYearShort
            AND month = :monthNameLowercase
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            fiscalYearShort,
            monthNameLowercase,
          },
        }
      )

      if (isNil(fiscalPeriod)) {
        console.warn(
          `No fiscal period found for ${fundingSubmissionLineJson.fiscalYearLegacy} ${fundingSubmissionLineJson.monthNameCapitalized}, skipping building expenses migration for this record`
        )
        continue
      }

      const fiscalPeriodId = fiscalPeriod.id

      const [centre] = await sequelize.query<{
        region: string
        buildingUsagePercent: string
      }>(
        sql`
          SELECT
            region,
            building_usage_percent AS buildingUsagePercent
          FROM
            centres
          WHERE
            id = :centreId
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            centreId: fundingSubmissionLineJson.centreId,
          },
        }
      )

      if (isNil(centre)) {
        console.warn(`No centre found for ID ${fundingSubmissionLineJson.centreId}, skipping`)
        continue
      }

      const { buildingUsagePercent } = centre

      for (const line of buildingExpenseLines) {
        const [buildingExpenseCategory] = await sequelize.query<{
          id: number
          subsidyRate: string
        }>(
          sql`
            SELECT
              building_expense_categories.id,
              building_expense_categories.subsidy_rate AS subsidyRate
            FROM
              building_expense_categories
              INNER JOIN funding_regions ON building_expense_categories.funding_region_id = funding_regions.id
            WHERE
              building_expense_categories.category_name = :categoryName
              AND funding_regions.region = :region
          `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              categoryName: line.lineName,
              region: centre.region,
            },
          }
        )

        if (isNil(buildingExpenseCategory)) {
          console.warn(
            `No building expense category found for "${line.lineName}" in region "${centre.region}", skipping this line`
          )
          continue
        }

        const [{ buildingExpenseCount }] = await sequelize.query<{ buildingExpenseCount: number }>(
          sql`
            SELECT
              COUNT(*) as buildingExpenseCount
            FROM
              building_expenses
            WHERE
              centre_id = :centreId
              AND fiscal_period_id = :fiscalPeriodId
              AND building_expense_category_id = :buildingExpenseCategoryId
          `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              centreId: fundingSubmissionLineJson.centreId,
              fiscalPeriodId,
              buildingExpenseCategoryId: buildingExpenseCategory.id,
            },
          }
        )

        if (buildingExpenseCount > 0) {
          continue
        }

        const estimatedCost = line.estimatedCost || "0.0000"
        const actualCost = line.actualCost || "0.0000"
        const totalCost = Big(actualCost)
          .mul(buildingExpenseCategory.subsidyRate)
          .mul(buildingUsagePercent)
          .div(100)
          .toFixed(4)

        await sequelize.query(
          sql`
            INSERT INTO
              building_expenses (
                centre_id,
                fiscal_period_id,
                building_expense_category_id,
                subsidy_rate,
                building_usage_percent,
                estimated_cost,
                actual_cost,
                total_cost,
                notes,
                created_at,
                updated_at
              )
            VALUES
              (
                :centreId,
                :fiscalPeriodId,
                :buildingExpenseCategoryId,
                :subsidyRate,
                :buildingUsagePercent,
                :estimatedCost,
                :actualCost,
                :totalCost,
                NULL,
                GETUTCDATE(),
                GETUTCDATE()
              )
          `,
          {
            replacements: {
              centreId: fundingSubmissionLineJson.centreId,
              fiscalPeriodId,
              buildingExpenseCategoryId: buildingExpenseCategory.id,
              subsidyRate: buildingExpenseCategory.subsidyRate,
              buildingUsagePercent,
              estimatedCost,
              actualCost,
              totalCost,
            },
          }
        )
      }

      await sequelize.query(
        sql`
          UPDATE funding_submission_line_jsons
          SET
            [values] = :updatedValues
          WHERE
            id = :recordId
        `,
        {
          replacements: {
            recordId: fundingSubmissionLineJson.id,
            updatedValues: JSON.stringify(otherLines),
          },
        }
      )
    }

    offset += BATCH_SIZE
  }

  console.log("Building expenses migration completed successfully")
}

export async function down({ context: _queryInterface }: Migration) {
  console.warn(
    "WARNING: This migration is not reversible. Building expenses were moved from funding_submission_line_jsons to building_expenses. Rolling back requires manual restoration of the original JSON data."
  )
}
