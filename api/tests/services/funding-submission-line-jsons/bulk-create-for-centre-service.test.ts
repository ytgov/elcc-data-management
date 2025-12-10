import { FundingSubmissionLineJson } from "@/models"

import { centreFactory, fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

import BulkCreateForCentreService from "@/services/funding-submission-line-jsons/bulk-create-for-centre-service"

describe("api/src/services/funding-submission-line-jsons/bulk-create-for-centre-service.ts", () => {
  describe("BulkCreateForCentreService", () => {
    describe("#perform", () => {
      test("when provided with a centre, funding period, and submission lines, creates funding submission line jsons for all months", async () => {
        // Arrange
        const centre = await centreFactory.create()
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const fundingSubmissionLineJsonsCount = await FundingSubmissionLineJson.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(fundingSubmissionLineJsonsCount).toEqual(12)
      })
    })
  })
})
