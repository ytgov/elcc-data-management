import { QueryTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

const BUILDING_EXPENSE_CATEGORY_NAMES = [
  "Rent or Mortgage",
  "Phone",
  "Internet",
  "Cell Phone",
  "Security",
  "Electric",
  "Fuel",
  "Garbage",
  "Snow Removal",
  "Water/Sewer/Taxes",
  "Insurance",
  "Janitorial",
  "Cleaning Supplies",
  "Minor Repairs",
]

export async function up({ context: { sequelize } }: Migration) {
  const fundingRegionsData = [
    { region: "whitehorse", subsidyRate: "0.3700" },
    { region: "communities", subsidyRate: "0.3700" },
  ]

  for (const fundingRegionData of fundingRegionsData) {
    const [existingFundingRegion] = await sequelize.query<{ id: number }>(
      sql`
        SELECT
          id
        FROM
          funding_regions
        WHERE
          region = :region
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          region: fundingRegionData.region,
        },
      }
    )

    let fundingRegionId: number

    if (existingFundingRegion) {
      fundingRegionId = existingFundingRegion.id
    } else {
      await sequelize.query(
        sql`
          INSERT INTO
            funding_regions (region, subsidy_rate, created_at, updated_at)
          VALUES
            (:region, :subsidyRate, GETUTCDATE(), GETUTCDATE())
        `,
        {
          replacements: {
            region: fundingRegionData.region,
            subsidyRate: fundingRegionData.subsidyRate,
          },
        }
      )

      const [newFundingRegion] = await sequelize.query<{ id: number }>(
        sql`
          SELECT
            id
          FROM
            funding_regions
          WHERE
            region = :region
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            region: fundingRegionData.region,
          },
        }
      )

      if (!newFundingRegion) {
        throw new Error(`Failed to create funding region: ${fundingRegionData.region}`)
      }

      fundingRegionId = newFundingRegion.id
    }

    for (const categoryName of BUILDING_EXPENSE_CATEGORY_NAMES) {
      const [existingBuildingExpenseCategory] = await sequelize.query<{ count: number }>(
        sql`
          SELECT
            COUNT(*) as count
          FROM
            building_expense_categories
          WHERE
            funding_region_id = :fundingRegionId
            AND category_name = :categoryName
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            fundingRegionId,
            categoryName,
          },
        }
      )

      if (existingBuildingExpenseCategory && existingBuildingExpenseCategory.count > 0) {
        continue
      }

      await sequelize.query(
        sql`
          INSERT INTO
            building_expense_categories (
              funding_region_id,
              category_name,
              subsidy_rate,
              created_at,
              updated_at
            )
          VALUES
            (
              :fundingRegionId,
              :categoryName,
              :subsidyRate,
              GETUTCDATE(),
              GETUTCDATE()
            )
        `,
        {
          replacements: {
            fundingRegionId,
            categoryName,
            subsidyRate: fundingRegionData.subsidyRate,
          },
        }
      )
    }
  }

  console.log("Backfilled funding regions and building expense categories successfully")
}

export async function down({ context: _queryInterface }: Migration) {
  console.warn(
    "WARNING: This migration backfills reference data. Rolling back would require manually removing the inserted funding regions and building expense categories."
  )
}
