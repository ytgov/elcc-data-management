import { isNil } from "lodash"

import {
  BuildingExpense,
  BuildingExpenseCategory,
  Centre,
  FiscalPeriod,
  FundingRegion,
} from "@/models"

export async function up() {
  const existingBuildingExpenseCount = await BuildingExpense.count()
  if (existingBuildingExpenseCount > 0) return

  await FundingRegion.findEach(async (fundingRegion) => {
    await BuildingExpenseCategory.findEach(
      {
        where: {
          fundingRegionId: fundingRegion.id,
        },
      },
      async (buildingExpenseCategory) => {
        await Centre.findEach(
          {
            where: {
              region: fundingRegion.region,
            },
          },
          async (centre) => {
            await FiscalPeriod.findEach(async (fiscalPeriod) => {
              const buildingExpense = await BuildingExpense.findOne({
                where: {
                  centreId: centre.id,
                  fiscalPeriodId: fiscalPeriod.id,
                  buildingExpenseCategoryId: buildingExpenseCategory.id,
                },
              })

              if (isNil(buildingExpense)) {
                await BuildingExpense.create({
                  centreId: centre.id,
                  fiscalPeriodId: fiscalPeriod.id,
                  buildingExpenseCategoryId: buildingExpenseCategory.id,
                  subsidyRate: buildingExpenseCategory.subsidyRate,
                  buildingUsagePercent: centre.buildingUsagePercent,
                  estimatedCost: "0.0000",
                  actualCost: "0.0000",
                  totalCost: "0.0000",
                })
              }
            })
          }
        )
      }
    )
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
