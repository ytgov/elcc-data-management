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
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          dateStart: new Date("2024-05-01"),
        })
        const fiscalPeriod3 = await fiscalPeriodFactory.create({
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
        const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll({
          order: ["fiscalPeriodId"],
        })
        expect(fundingReconciliationAdjustments).toEqual([
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod1.id,
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod2.id,
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod3.id,
          }),
        ])
      })

      test("when centre has funding reconciliations for multiple funding periods, creates adjustments only for fiscal periods belonging to each funding period", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod1 = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fundingPeriod2 = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })

        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-05-01"),
        })

        const fiscalPeriod3 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod2.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })

        const fundingReconcilation1 = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod1.id,
        })
        const fundingReconciliation2 = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod2.id,
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const fundingReconcilationAdjustments = await FundingReconciliationAdjustment.findAll({
          order: ["fundingReconciliationId", "fiscalPeriodId"],
        })
        expect(fundingReconcilationAdjustments).toEqual([
          expect.objectContaining({
            fundingReconciliationId: fundingReconcilation1.id,
            fiscalPeriodId: fiscalPeriod1.id,
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconcilation1.id,
            fiscalPeriodId: fiscalPeriod2.id,
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation2.id,
            fiscalPeriodId: fiscalPeriod3.id,
          }),
        ])
      })
    })
  })
})
