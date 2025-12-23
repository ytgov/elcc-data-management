import { BuildingExpense } from "@/models"

import {
  buildingExpenseCategoryFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkCreateBuildingExpensesService from "@/services/centres/funding-periods/bulk-create-building-expenses-service"

describe("api/src/services/centres/funding-periods/bulk-create-building-expenses-service.ts", () => {
  describe("BulkCreateBuildingExpensesService", () => {
    describe("#perform", () => {
      test("when provided a centre, and funding period, and fiscal periods, and building expense categories, creates building expenses for all fiscal periods", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-05-01"),
        })

        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const centre = await centreFactory
          .transient({
            include: ["fundingRegion"],
          })
          .create({
            fundingRegionId: fundingRegion.id,
            buildingUsagePercent: "80",
          })

        // Act
        await BulkCreateBuildingExpensesService.perform(centre, fundingPeriod)

        // Assert
        const buildingExpensesCount = await BuildingExpense.count({
          where: { centreId: centre.id },
        })
        expect(buildingExpensesCount).toEqual(4) // 2 fiscal periods × 2 categories
      })

      test("when building expenses are created, they have correct default values", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-04-01"),
        })

        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          categoryName: "Rent or Mortgage-1",
        })
        const centre = await centreFactory
          .transient({
            include: ["fundingRegion"],
          })
          .create({
            fundingRegionId: fundingRegion.id,
            buildingUsagePercent: "75",
          })

        // Act
        await BulkCreateBuildingExpensesService.perform(centre, fundingPeriod)

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

      test("when centre has no building expense categories for its funding region, errors informatively", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })

        const fundingRegion1 = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion1.id,
        })

        const fundingRegion2 = await fundingRegionFactory.create()
        await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion2.id,
          categoryName: "Rent or Mortgage-1",
        })

        // Act
        expect.assertions(1)
        await expect(
          BulkCreateBuildingExpensesService.perform(centre, fundingPeriod)
        ).rejects.toThrow("No building expense categories found for the centre's funding region.")
      })

      test("when no fiscal periods exist for the funding period, errors informatively", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          categoryName: "Rent or Mortgage-1",
        })
        const centre = await centreFactory
          .transient({
            include: ["fundingRegion"],
          })
          .create({
            fundingRegionId: fundingRegion.id,
            buildingUsagePercent: "75",
          })

        // Act
        expect.assertions(1)
        await expect(
          BulkCreateBuildingExpensesService.perform(centre, fundingPeriod)
        ).rejects.toThrow("No fiscal periods found for funding period.")
      })
    })
  })
})
