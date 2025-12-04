import { isNil } from "lodash"

import { BuildingExpenseCategory, FundingRegion } from "@/models"

const BUILDING_EXPENSE_CATEGORY_DEFAULTS = [
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

export async function up() {
  await FundingRegion.findEach(async (fundingRegion) => {
    for (const categoryName of BUILDING_EXPENSE_CATEGORY_DEFAULTS) {
      const buildingExpenseCategory = await BuildingExpenseCategory.findOne({
        where: {
          fundingRegionId: fundingRegion.id,
          categoryName: categoryName,
        },
      })

      if (isNil(buildingExpenseCategory)) {
        await BuildingExpenseCategory.create({
          fundingRegionId: fundingRegion.id,
          categoryName: categoryName,
          subsidyRate: fundingRegion.subsidyRate,
        })
      }
    }
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
