import { BuildingExpenseCategory } from "@/models"

import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

describe("api/src/models/building-expense-category.ts", () => {
  describe("BuildingExpenseCategory", () => {
    describe(".withScopes", () => {
      describe(".excludingUsedByCentreFiscalPeriod scope", () => {
        test("when category already has an active building expense for the centre and fiscal period, excludes it", async () => {
          // Arrange
          const fundingRegion = await fundingRegionFactory.create()
          const centre = await centreFactory.create({
            fundingRegionId: fundingRegion.id,
          })
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2025-2026",
          })
          const fiscalPeriod = await fiscalPeriodFactory.create({
            fundingPeriodId: fundingPeriod.id,
            fiscalYear: "2025-26",
          })
          const matchedCategory = await buildingExpenseCategoryFactory.create({
            fundingRegionId: fundingRegion.id,
            categoryName: "Matched Category",
          })
          const availableCategory = await buildingExpenseCategoryFactory.create({
            fundingRegionId: fundingRegion.id,
            categoryName: "Available Category",
          })
          await buildingExpenseFactory.create({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            categoryId: matchedCategory.id,
          })

          // Act
          const buildingExpenseCategories = await BuildingExpenseCategory.withScope({
            method: [
              "excludingUsedByCentreFiscalPeriod",
              { centreId: centre.id, fiscalPeriodId: fiscalPeriod.id },
            ],
          }).findAll()

          // Assert
          expect(buildingExpenseCategories).toEqual([
            expect.objectContaining({
              id: availableCategory.id,
            }),
          ])
        })

        test("when matching building expense is soft deleted, keeps the category available", async () => {
          // Arrange
          const fundingRegion = await fundingRegionFactory.create()
          const centre = await centreFactory.create({
            fundingRegionId: fundingRegion.id,
          })
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2025-2026",
          })
          const fiscalPeriod = await fiscalPeriodFactory.create({
            fundingPeriodId: fundingPeriod.id,
            fiscalYear: "2025-26",
          })
          const availableCategory = await buildingExpenseCategoryFactory.create({
            fundingRegionId: fundingRegion.id,
            categoryName: "Soft Deleted Match Category",
          })
          const softDeletedBuildingExpense = await buildingExpenseFactory.create({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            categoryId: availableCategory.id,
          })
          await softDeletedBuildingExpense.destroy()

          // Act
          const buildingExpenseCategories = await BuildingExpenseCategory.withScope({
            method: [
              "excludingUsedByCentreFiscalPeriod",
              { centreId: centre.id, fiscalPeriodId: fiscalPeriod.id },
            ],
          }).findAll()

          // Assert
          expect(buildingExpenseCategories).toEqual([
            expect.objectContaining({
              id: availableCategory.id,
            }),
          ])
        })
      })
    })
  })
})
