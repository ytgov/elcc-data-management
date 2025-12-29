import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationFactory,
} from "@/factories"

import BulkCreateService from "@/services/funding-reconciliations/funding-periods/funding-reconciliation-adjustments/bulk-create-service"

describe("api/src/services/funding-reconciliations/funding-periods/funding-reconciliation-adjustments/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when provided a funding reconciliation and funding period, creates adjustments for all fiscal periods", async () => {
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
        const fundingReconciliationAdjustments = await BulkCreateService.perform(
          fundingReconciliation,
          fundingPeriod
        )

        // Assert
        expect(fundingReconciliationAdjustments).toEqual([
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod1.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod2.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod3.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          }),
        ])
      })

      test("when funding period doesn not have any fiscal periods, errors informatively", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        // Act & Assert
        expect.assertions(1)
        await expect(
          BulkCreateService.perform(fundingReconciliation, fundingPeriod)
        ).rejects.toThrow("No fiscal periods found for the funding period.")
      })
    })
  })
})
