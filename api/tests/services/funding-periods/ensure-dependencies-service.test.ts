import { BuildingExpense, FiscalPeriod, FundingSubmissionLineJson } from "@/models"
import { FundingSubmissionLineJsonMonths } from "@/models/funding-submission-line-json"
import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
  fundingSubmissionLineFactory,
  fundingSubmissionLineJsonFactory,
} from "@/factories"

import EnsureDependenciesService from "@/services/funding-periods/ensure-dependencies-service"

describe("api/src/services/funding-periods/ensure-dependencies-service.ts", () => {
  describe("EnsureDependenciesService", () => {
    describe("#perform", () => {
      test("when funding period spans full year, and there are funding submission lines, creates funding submission line json records for each month", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2024-04-01"),
          dateEnd: new Date("2024-04-30"),
        })
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll({
          order: ["dateStart"],
        })
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "April",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "May",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "June",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "July",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "August",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "September",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "October",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "November",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "December",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "January",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "February",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "March",
          }),
        ])
      })

      test("when ensuring dependencies, templates default zero values for each funding submission line", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await buildingExpenseCategoryFactory.create()
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const fundingSubmissionLineJson = await FundingSubmissionLineJson.findOne({
          order: ["dateStart"],
          rejectOnEmpty: true,
        })
        expect(fundingSubmissionLineJson.lines).toEqual([
          expect.objectContaining({
            estimatedChildOccupancyRate: "0",
            actualChildOccupancyRate: "0",
            estimatedComputedTotal: "0",
            actualComputedTotal: "0",
          }),
          expect.objectContaining({
            estimatedChildOccupancyRate: "0",
            actualChildOccupancyRate: "0",
            estimatedComputedTotal: "0",
            actualComputedTotal: "0",
          }),
          expect.objectContaining({
            estimatedChildOccupancyRate: "0",
            actualChildOccupancyRate: "0",
            estimatedComputedTotal: "0",
            actualComputedTotal: "0",
          }),
        ])
      })

      test("when funding submission line json records already exist for the centre and fiscal year, does not create duplicates", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await buildingExpenseCategoryFactory.create()
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        const fundingSubmissionLineJson = await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2024/25",
          dateName: FundingSubmissionLineJsonMonths.APRIL,
          dateStart: new Date("2024-04-01T00:00:00Z"),
          dateEnd: new Date("2024-04-30T23:59:59Z"),
          values: JSON.stringify([]),
        })

        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            id: fundingSubmissionLineJson.id,
          }),
        ])
      })

      test("when there are no funding submission lines for the fiscal year, throws an error", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act & Assert
        await expect(EnsureDependenciesService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No funding submission lines to template from found for the given fiscal year: 2024/25"
        )
      })

      test("creates building expenses for the centre for all fiscal periods and categories", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })

        const buildingExpenseCategory1 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const buildingExpenseCategory2 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll({
          where: {
            centreId: centre.id,
          },
          order: [
            ["fiscalPeriodId", "ASC"],
            ["buildingExpenseCategoryId", "ASC"],
          ],
        })
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            buildingExpenseCategoryId: buildingExpenseCategory1.id,
            subsidyRate: buildingExpenseCategory1.subsidyRate,
            buildingUsagePercent: "100",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            buildingExpenseCategoryId: buildingExpenseCategory2.id,
            subsidyRate: buildingExpenseCategory2.subsidyRate,
            buildingUsagePercent: "100",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
        ])
      })

      test("when building expenses already exist for the centre and fiscal year, does not create duplicates", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })

        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const buildingExpense = await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          buildingExpenseCategoryId: buildingExpenseCategory.id,
          subsidyRate: "0.5",
          buildingUsagePercent: "100",
          estimatedCost: "1000",
          actualCost: "1000",
          totalCost: "500",
        })

        // Act
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            id: buildingExpense.id,
          }),
        ])
      })

      test("when there are no fiscal periods for the fiscal year, throws an error", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        // Act & Assert
        await expect(EnsureDependenciesService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for fiscal year: 2024-25"
        )
      })

      test("when there are no building expense categories, throws an error", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })

        // Act & Assert
        await expect(EnsureDependenciesService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No building expense categories found"
        )
      })
    })
  })
})
