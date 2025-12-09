import { FundingSubmissionLineJson } from "@/models"
import { FundingSubmissionLineJsonMonths } from "@/models/funding-submission-line-json"
import { centreFactory, fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

import EnsureDependenciesService from "@/services/funding-periods/ensure-dependencies-service"

describe("api/src/services/funding-periods/ensure-dependencies-service.ts", () => {
  describe("EnsureDependenciesService", () => {
    describe("#perform", () => {
      test("when funding period spans full year, and there are funding submission lines, creates funding submission line json records for each month", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
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
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
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

      test("when funding submission line json records already exist for the centre and fiscal year, throws an error", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })

        await FundingSubmissionLineJson.create({
          centreId: centre.id,
          fiscalYear: "2024/25",
          dateName: FundingSubmissionLineJsonMonths.APRIL,
          dateStart: new Date("2024-04-01T00:00:00Z"),
          dateEnd: new Date("2024-04-30T23:59:59Z"),
          values: JSON.stringify([]),
        })

        // Act & Assert
        await expect(EnsureDependenciesService.perform(centre, fundingPeriod)).rejects.toThrow(
          "already exist"
        )
      })

      test("when there are no funding submission lines for the fiscal year, throws an error", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        // Act & Assert
        await expect(EnsureDependenciesService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No funding submission lines to template from found for the given fiscal year: 2024/25"
        )
      })
    })
  })
})
