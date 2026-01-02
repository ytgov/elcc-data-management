import {
  buildingExpenseCategoryFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkCreateService from "@/services/centres/funding-periods/building-expenses/bulk-create-service"

describe("api/src/services/centres/funding-periods/building-expenses/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when provided a centre, and funding period, and fiscal periods, and building expense categories, creates building expenses for all fiscal periods", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-05-01"),
        })

        const fundingRegion = await fundingRegionFactory.create({
          region: "Test Region",
        })
        const buildingExpenseCategory1 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          subsidyRate: "0.25",
        })
        const buildingExpenseCategory2 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          subsidyRate: "0.5",
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "80",
        })

        // Act
        const buildingExpenses = await BulkCreateService.perform(centre, fundingPeriod)

        // Assert
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            buildingExpenseCategoryId: buildingExpenseCategory1.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.25",
            buildingUsagePercent: "80",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            buildingExpenseCategoryId: buildingExpenseCategory2.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            buildingExpenseCategoryId: buildingExpenseCategory1.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.25",
            buildingUsagePercent: "80",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            buildingExpenseCategoryId: buildingExpenseCategory2.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
        ])
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
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "75",
        })

        // Act
        expect.assertions(1)
        await expect(BulkCreateService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for funding period."
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
        await expect(BulkCreateService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No building expense categories found for the centre's funding region."
        )
      })
    })
  })
})
