import { BuildingExpense } from "@/models"

import {
  buildingExpenseCategoryFactory,
  centreFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkCreateForCentreService from "@/services/building-expenses/bulk-create-for-centre-service"
import { FiscalPeriods } from "@/services"

describe("api/src/services/building-expenses/bulk-create-for-centre-service.ts", () => {
  describe("BulkCreateForCentreService", () => {
    describe("#perform", () => {
      test("when provided a centre with a funding region that has building expense categories, creates building expenses for all fiscal periods", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await FiscalPeriods.BulkEnsureForFundingPeriodService.perform(fundingPeriod)
        await buildingExpenseCategoryFactory.createList(3, {
          fundingRegionId: fundingRegion.id,
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "80",
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const buildingExpensesCount = await BuildingExpense.count({
          where: { centreId: centre.id },
        })
        expect(buildingExpensesCount).toEqual(36) // 12 fiscal periods × 3 categories
      })

      test("when building expenses are created, they have correct default values", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await FiscalPeriods.BulkEnsureForFundingPeriodService.perform(fundingPeriod)
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "75",
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const buildingExpense = await BuildingExpense.findOne({
          where: {
            centreId: centre.id,
          },
        })
        expect(buildingExpense).toEqual(
          expect.objectContaining({
            buildingUsagePercent: "75",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          })
        )
      })

      test("when centre has no building expense categories for its funding region, creates no building expenses", async () => {
        // Arrange
        const fundingRegion1 = await fundingRegionFactory.create()
        const fundingRegion2 = await fundingRegionFactory.create()
        await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        // Create categories for a different region
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion2.id,
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion1.id,
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const buildingExpensesCount = await BuildingExpense.count({
          where: { centreId: centre.id },
        })

        expect(buildingExpensesCount).toEqual(0)
      })
    })
  })
})
