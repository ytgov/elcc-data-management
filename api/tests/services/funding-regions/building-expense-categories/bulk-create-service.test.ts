import { buildingExpenseCategoryFactory, fundingRegionFactory } from "@/factories"

import BulkCreateService from "@/services/funding-regions/building-expense-categories/bulk-create-service"

describe("api/src/services/funding-regions/building-expense-categories/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when no building expense categories exist, creates categories from defaults", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create({
          region: "Test Region",
          subsidyRate: "0.3700",
        })

        // Act
        const buildingExpenseCategories = await BulkCreateService.perform(fundingRegion)

        // Assert
        expect(buildingExpenseCategories).toEqual([
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Rent or Mortgage",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Phone",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Internet",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Cell Phone",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Security",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Electric",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Fuel",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Garbage",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Snow Removal",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Water/Sewer/Taxes",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Insurance",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Janitorial",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Cleaning Supplies",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            categoryName: "Minor Repairs",
            subsidyRate: "0.37",
          }),
        ])
      })

      test("when building expense categories exist in another region, copies from newest region, but uses target region's subsidy rate", async () => {
        // Arrange
        const olderFundingRegion = await fundingRegionFactory.create({
          region: "Older Region",
          subsidyRate: "0.3400",
          createdAt: new Date("2024-01-01"),
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: olderFundingRegion.id,
          subsidyRate: "0.3400",
          categoryName: "Rent or Mortgage",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: olderFundingRegion.id,
          subsidyRate: "0.3400",
          categoryName: "Phone",
        })

        const newerFundingRegion = await fundingRegionFactory.create({
          region: "Newer Region",
          createdAt: new Date("2024-02-01"),
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: newerFundingRegion.id,
          subsidyRate: "0.3400",
          categoryName: "Internet",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: newerFundingRegion.id,
          subsidyRate: "0.3400",
          categoryName: "Cell Phone",
        })

        const targetFundingRegion = await fundingRegionFactory.create({
          region: "Target Region",
          subsidyRate: "0.3700",
        })

        // Act
        const buildingExpenseCategories = await BulkCreateService.perform(targetFundingRegion)

        // Assert
        expect(buildingExpenseCategories).toEqual([
          expect.objectContaining({
            categoryName: "Internet",
            subsidyRate: "0.37",
          }),
          expect.objectContaining({
            categoryName: "Cell Phone",
            subsidyRate: "0.37",
          }),
        ])
      })
    })
  })
})
