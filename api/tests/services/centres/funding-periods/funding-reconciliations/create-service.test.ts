import { FundingReconciliation, FundingReconciliationAdjustment } from "@/models"

import { centreFactory, fiscalPeriodFactory, fundingPeriodFactory } from "@/factories"

import CreateService from "@/services/centres/funding-periods/funding-reconciliations/create-service"

describe("api/src/services/centres/funding-periods/funding-reconciliations/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when provided with a centre and funding period, creates funding reconciliation", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2023-24",
          dateStart: new Date("2023-04-01"),
        })

        // Act
        const fundingReconciliation = await CreateService.perform(centre, fundingPeriod)

        // Assert
        expect(fundingReconciliation).toEqual(
          expect.objectContaining({
            centreId: centre.id,
            fundingPeriodId: fundingPeriod.id,
            status: FundingReconciliation.Statuses.DRAFT,
            fundingReceivedTotalAmount: "0",
            eligibleExpensesTotalAmount: "0",
            payrollAdjustmentsTotalAmount: "0",
            finalBalanceAmount: "0",
          })
        )
      })

      test("when creating funding reconciliation, creates child funding reconciliation adjustments", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2023-24",
          dateStart: new Date("2023-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })

        // Act
        const fundingReconciliation = await CreateService.perform(centre, fundingPeriod)

        // Assert
        const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll()
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
          })
        ])
      })
    })
  })
})
