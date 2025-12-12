import FiscalPeriod from "@/models/fiscal-period"

import { FundingSubmissionLineJson } from "@/models"

import {
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingSubmissionLineJsonFactory,
} from "@/factories"

import CalculateEligibleExpensesPeriodAmountService from "@/services/funding-reconciliations/calculate-eligible-expenses-period-amount-service"

describe("api/src/services/funding-reconciliations/calculate-eligible-expenses-period-amount-service.ts", () => {
  describe("CalculateEligibleExpensesPeriodAmountService", () => {
    describe("#perform", () => {
      test("when there are eligible expenses, returns the total amount", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 50.0,
            },
          ]),
        })

        // Act
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("50.0000")
      })

      test("when there are no eligible expenses, returns zero", async () => {
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
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("0.0000")
      })

      test("when there are multiple funding submission line jsons for the same month, sums them correctly", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 30.0,
            },
          ]),
        })
        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 70.0,
            },
          ]),
        })

        // Act
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("100.0000")
      })

      test("when eligible expenses have multiple lines in values array, sums them correctly", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 25.0,
            },
            {
              actualComputedTotal: 35.0,
            },
            {
              actualComputedTotal: 40.0,
            },
          ]),
        })

        // Act
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("100.0000")
      })

      test("when there are building expenses, includes them in the total", async () => {
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

        await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2025/26",
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2025-04-01"),
          dateEnd: new Date("2025-04-30"),
          values: JSON.stringify([
            {
              actualComputedTotal: 50.0,
            },
          ]),
        })

        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          subsidyRate: "1.0000",
          buildingUsagePercent: "100.00",
          estimatedCost: "30.0000",
          actualCost: "30.0000",
          totalCost: "30.0000",
        })

        // Act
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("80.0000")
      })

      test("when there are only building expenses and no funding submission lines, returns building expenses total", async () => {
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

        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          subsidyRate: "1.0000",
          buildingUsagePercent: "100.00",
          estimatedCost: "25.0000",
          actualCost: "25.0000",
          totalCost: "25.0000",
        })

        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          subsidyRate: "1.0000",
          buildingUsagePercent: "100.00",
          estimatedCost: "35.0000",
          actualCost: "35.0000",
          totalCost: "35.0000",
        })

        // Act
        const result = await CalculateEligibleExpensesPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("60.0000")
      })
    })
  })
})
