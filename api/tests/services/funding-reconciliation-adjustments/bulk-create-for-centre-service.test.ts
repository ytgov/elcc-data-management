import { FundingReconciliationAdjustment } from "@/models"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationFactory,
} from "@/factories"

import BulkCreateForCentreService from "@/services/funding-reconciliation-adjustments/bulk-create-for-centre-service"

describe("api/src/services/funding-reconciliation-adjustments/bulk-create-for-centre-service.ts", () => {
  describe("BulkCreateForCentreService", () => {
    describe("#perform", () => {
      test("when centre has funding reconciliations, creates adjustments for all fiscal periods", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-04-01"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-05-01"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-06-01"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const adjustmentsCount = await FundingReconciliationAdjustment.count({
          where: {
            fundingReconciliationId: fundingReconciliation.id,
          },
        })
        expect(adjustmentsCount).toEqual(3)
      })
    })
  })
})
