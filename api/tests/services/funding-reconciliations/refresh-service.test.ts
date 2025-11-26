import FiscalPeriod from "@/models/fiscal-period"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationAdjustmentFactory,
  fundingReconciliationFactory,
  paymentFactory,
} from "@/factories"

import RefreshService from "@/services/funding-reconciliations/refresh-service"

describe("api/src/services/funding-reconciliations/refresh-service.ts", () => {
  describe("RefreshService", () => {
    describe("#perform", () => {
      test("when there are payments, updates funding reconciliation funding received and final balance amounts", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create()
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })

        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          amountInCents: 150 * 100, // $150.00
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "150.0000",
            finalBalanceAmount: "150.0000",
          })
        )
      })

      test("when there are no payments, updates funding reconciliation funding received and final balance amount to zero", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create()
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
          fundingReceivedTotalAmount: "1000",
          finalBalanceAmount: "1000",
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })

        // Act
        const result = await RefreshService.perform(fundingReconciliation)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "0.0000",
            finalBalanceAmount: "0.0000",
          })
        )
      })

      test("when there is a payment on the first month, updates funding reconciliation adjustments for that month", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create()
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
        })
        const fundingReconciliationAdjustment = await fundingReconciliationAdjustmentFactory.create(
          {
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
          }
        )

        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          amountInCents: 150 * 100, // $150.00
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliationAdjustment.reload()
        expect(fundingReconciliationAdjustment).toEqual(
          expect.objectContaining({
            fundingReceivedPeriodAmount: "150",
            cumulativeBalanceAmount: "150",
          })
        )
      })

      test("when there is a payment on first and second months, updates funding reconciliation adjustments for those months, and sets correct cumulative and final balances", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })

        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amountInCents: 150 * 100, // $150.00
        })

        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.MAY,
          dateStart: new Date("2025-05-01"),
          dateEnd: new Date("2025-05-31"),
        })
        await fundingReconciliationAdjustmentFactory.create({
          fundingReconciliationId: fundingReconciliation.id,
          fiscalPeriodId: fiscalPeriod2.id,
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          fiscalYear: "2025/26",
          paidOn: "2025-05-15",
          amountInCents: 200 * 100, // $200.00
        })

        // Act
        await RefreshService.perform(fundingReconciliation)

        // Assert
        await fundingReconciliation.reload({
          include: [
            {
              association: "adjustments",
              include: [
                {
                  association: "fiscalPeriod",
                  attributes: ["dateStart"],
                },
              ],
            },
          ],
          order: [["adjustments", "fiscalPeriod", "dateStart", "ASC"]],
        })
        expect(fundingReconciliation).toEqual(
          expect.objectContaining({
            fundingReceivedTotalAmount: "350",
            finalBalanceAmount: "350",
            adjustments: [
              expect.objectContaining({
                fundingReceivedPeriodAmount: "150",
                cumulativeBalanceAmount: "150",
              }),
              expect.objectContaining({
                fundingReceivedPeriodAmount: "200",
                cumulativeBalanceAmount: "350",
              }),
            ],
          })
        )
      })
    })
  })
})
