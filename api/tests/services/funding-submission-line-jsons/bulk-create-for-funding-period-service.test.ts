import { FundingSubmissionLineJson } from "@/models"
import { centreFactory, fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

import BulkCreateForFundingPeriodService from "@/services/funding-submission-line-jsons/bulk-create-for-funding-period-service"

describe("api/src/services/funding-submission-line-jsons/bulk-create-for-funding-period-service.ts", () => {
  describe("BulkCreateForFundingPeriodService", () => {
    describe("#perform", () => {
      test("when funding period has centres and submission lines, creates funding submission line jsons for all centres and months", async () => {
        // Arrange
        await centreFactory.createList(2)
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
        })

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLineJsonsCount = await FundingSubmissionLineJson.count()
        expect(fundingSubmissionLineJsonsCount).toEqual(24) // 2 centres × 12 months = 24 records
      })

      test("when funding period has no centres, creates no funding submission line jsons", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.createList(3, {
          fiscalYear: "2024/25",
        })

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLineJsonsCount = await FundingSubmissionLineJson.count()
        expect(fundingSubmissionLineJsonsCount).toEqual(0)
      })

      test("when funding period has no funding submission lines to template from, throws an error", async () => {
        // Arrange
        await centreFactory.createList(2)
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        // Act & Assert
        await expect(BulkCreateForFundingPeriodService.perform(fundingPeriod)).rejects.toThrow(
          "No funding submission lines to template from found for the given fiscal year: 2024/25"
        )
      })

      test("when creating funding submission line jsons, uses correct (legacy) fiscal year format", async () => {
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

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLineJson = await FundingSubmissionLineJson.findOne({
          where: {
            centreId: centre.id,
          },
        })
        expect(fundingSubmissionLineJson).toEqual(
          expect.objectContaining({
            fiscalYear: "2024/25",
          })
        )
      })

      test("when creating funding submission line jsons, sets correct date range for April", async () => {
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

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const aprilRecord = await FundingSubmissionLineJson.findOne({
          where: {
            centreId: centre.id,
            dateName: "April",
          },
          rejectOnEmpty: true,
        })

        expect(aprilRecord).toEqual(
          expect.objectContaining({
            dateName: "April",
            dateStart: new Date("2024-04-01T00:00:00Z"),
            dateEnd: new Date("2024-04-30T23:59:59Z"),
          })
        )
      })

      test("when creating funding submission line jsons, sets correct date range for March", async () => {
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

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const marchRecord = await FundingSubmissionLineJson.findOne({
          where: {
            centreId: centre.id,
            dateName: "March",
          },
          rejectOnEmpty: true,
        })

        expect(marchRecord).toEqual(
          expect.objectContaining({
            dateName: "March",
            dateStart: new Date("2025-03-01T00:00:00Z"),
            dateEnd: new Date("2025-03-31T23:59:59Z"),
          })
        )
      })

      test("when creating funding submission line jsons, includes default values from submission lines", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const submissionLine = await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "Test Section",
          lineName: "Test Line",
          monthlyAmount: "100.50",
        })

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLineJson = await FundingSubmissionLineJson.findOne({
          where: {
            centreId: centre.id,
          },
          rejectOnEmpty: true,
        })
        const values = JSON.parse(fundingSubmissionLineJson.values)
        expect(values).toEqual([
          expect.objectContaining({
            submissionLineId: submissionLine.id,
            sectionName: "Test Section",
            lineName: "Test Line",
            monthlyAmount: "100.5",
            estimatedChildOccupancyRate: "0",
            actualChildOccupancyRate: "0",
            estimatedComputedTotal: "0",
            actualComputedTotal: "0",
          }),
        ])
      })

      test("when creating funding submission line jsons for multiple submission lines, includes all lines in values", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fundingSubmissionLineFactory.createList(2, {
          fiscalYear: "2024/25",
        })

        // Act
        await BulkCreateForFundingPeriodService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLineJson = await FundingSubmissionLineJson.findOne({
          where: {
            centreId: centre.id,
          },
          rejectOnEmpty: true,
        })
        const values = JSON.parse(fundingSubmissionLineJson.values)
        expect(values).toEqual([
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
    })
  })
})
