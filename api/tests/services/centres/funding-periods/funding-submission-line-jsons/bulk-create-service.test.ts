import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingSubmissionLineFactory,
} from "@/factories"

import BulkCreateService from "@/services/centres/funding-periods/funding-submission-line-jsons/bulk-create-service"

describe("api/src/services/centres/funding-periods/funding-submission-line-jsons/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when provided with a centre, funding period, and submission lines, creates funding submission line jsons for all months", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2024-05-30"),
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
        const fundingSubmissionLine1 = await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "Child Care Spaces",
          lineName: "Infants",
          monthlyAmount: "100",
        })
        const fundingSubmissionLine2 = await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "Administration (10% of Spaces)",
          lineName: "Toddlers",
          monthlyAmount: "200",
        })

        // Act
        const fundingSubmissionLineJsons = await BulkCreateService.perform(centre, fundingPeriod)

        // Assert
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "April",
            dateStart: new Date("2024-04-01T00:00:00.000Z"),
            dateEnd: new Date("2024-04-30T23:59:59.000Z"),
            values: JSON.stringify([
              {
                submissionLineId: fundingSubmissionLine1.id,
                sectionName: "Child Care Spaces",
                lineName: "Infants",
                monthlyAmount: "100",
                estimatedChildOccupancyRate: "0",
                actualChildOccupancyRate: "0",
                estimatedComputedTotal: "0",
                actualComputedTotal: "0",
              },
              {
                submissionLineId: fundingSubmissionLine2.id,
                sectionName: "Administration (10% of Spaces)",
                lineName: "Toddlers",
                monthlyAmount: "200",
                estimatedChildOccupancyRate: "0",
                actualChildOccupancyRate: "0",
                estimatedComputedTotal: "0",
                actualComputedTotal: "0",
              },
            ]),
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: "May",
            dateStart: new Date("2024-05-01T00:00:00.000Z"),
            dateEnd: new Date("2024-05-31T23:59:59.000Z"),
            values: JSON.stringify([
              {
                submissionLineId: fundingSubmissionLine1.id,
                sectionName: "Child Care Spaces",
                lineName: "Infants",
                monthlyAmount: "100",
                estimatedChildOccupancyRate: "0",
                actualChildOccupancyRate: "0",
                estimatedComputedTotal: "0",
                actualComputedTotal: "0",
              },
              {
                submissionLineId: fundingSubmissionLine2.id,
                sectionName: "Administration (10% of Spaces)",
                lineName: "Toddlers",
                monthlyAmount: "200",
                estimatedChildOccupancyRate: "0",
                actualChildOccupancyRate: "0",
                estimatedComputedTotal: "0",
                actualComputedTotal: "0",
              },
            ]),
          }),
        ])
      })

      test("when there are no fiscal periods for funding period, errors informatively", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2024-05-30"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "Child Care Spaces",
          lineName: "Infants",
          monthlyAmount: "100",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "Administration (10% of Spaces)",
          lineName: "Toddlers",
          monthlyAmount: "200",
        })

        // Act & Assert
        expect.assertions(1)
        await expect(BulkCreateService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for the given funding period"
        )
      })

      test("when funding submission lines are missing, errors informatively", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2024-05-30"),
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

        // Act & Assert
        expect.assertions(1)
        await expect(BulkCreateService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No funding submission lines found for the funding period."
        )
      })
    })
  })
})
