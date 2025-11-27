import FiscalPeriod from "@/models/fiscal-period"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  paymentFactory,
} from "@/factories"

import CalculateFundingReceivedPeriodAmountService from "@/services/funding-reconciliations/calculate-funding-received-period-amount-service"

describe("api/src/services/funding-reconciliations/calculate-funding-received-period-amount-service.ts", () => {
  describe("CalculateFundingReceivedPeriodAmountService", () => {
    describe("#perform", () => {
      test("when there are payments, returns the total amount in dollars", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })

        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-15",
          amountInCents: 150 * 100, // $150.00
        })

        // Act
        const result = await CalculateFundingReceivedPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("150.0000")
      })

      test("when there are no payments, returns zero", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })

        // Act
        const result = await CalculateFundingReceivedPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("0.0000")
      })

      test("when there are multiple payments, sums them correctly", async () => {
        // Arrange
        const centre = await centreFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
        })

        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-10",
          amountInCents: 100 * 100, // $100.00
        })
        await paymentFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          fiscalYear: "2025/26",
          paidOn: "2025-04-20",
          amountInCents: 200 * 100, // $200.00
        })

        // Act
        const result = await CalculateFundingReceivedPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("300.0000")
      })
    })
  })
})
