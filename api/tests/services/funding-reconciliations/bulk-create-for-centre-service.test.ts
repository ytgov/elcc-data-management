import { FundingReconciliation } from "@/models"

import { centreFactory, fundingPeriodFactory } from "@/factories"

import BulkCreateForCentreService from "@/services/funding-reconciliations/bulk-create-for-centre-service"

describe("api/src/services/funding-reconciliations/bulk-create-for-centre-service.ts", () => {
  describe("BulkCreateForCentreService", () => {
    describe("#perform", () => {
      test("when provided with a centre and existing funding periods, creates funding reconciliations for all funding periods", async () => {
        // Arrange
        const centre = await centreFactory.create()
        await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const fundingReconciliationsCount = await FundingReconciliation.count({
          where: {
            centreId: centre.id,
          },
        })
        expect(fundingReconciliationsCount).toEqual(1)
      })
    })
  })
})
