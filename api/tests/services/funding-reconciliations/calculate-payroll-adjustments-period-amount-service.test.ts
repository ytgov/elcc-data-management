import FiscalPeriod from "@/models/fiscal-period"

import {
  centreFactory,
  employeeBenefitFactory,
  employeeWageTierFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  wageEnhancementFactory,
} from "@/factories"

import CalculatePayrollAdjustmentsPeriodAmountService from "@/services/funding-reconciliations/calculate-payroll-adjustments-period-amount-service"

describe("api/src/services/funding-reconciliations/calculate-payroll-adjustments-period-amount-service.ts", () => {
  describe("CalculatePayrollAdjustmentsPeriodAmountService", () => {
    describe("#perform", () => {
      test("when there are employee benefits with employerCostActual less than cost cap, uses employerCostActual", async () => {
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

        // employerCostActual (100) < grossPayrollMonthlyActual (10000) * costCapPercentage (0.02) = 200
        // So minimum should be 100
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("100.0000")
      })

      test("when there are employee benefits with cost cap less than employerCostActual, uses cost cap", async () => {
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

        // employerCostActual (500) > grossPayrollMonthlyActual (10000) * costCapPercentage (0.03) = 300
        // So minimum should be 300
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.03,
          employeeCostActual: 250,
          employeeCostEstimated: 250,
          employerCostActual: 500,
          employerCostEstimated: 500,
        })

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("300.0000")
      })

      test("when there are no employee benefits or wage enhancements, returns zero", async () => {
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
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("0.0000")
      })

      test("when there are employee benefits with summed values, calculates correctly", async () => {
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

        // Employee benefit with summed values: min(400, 25000 * 0.05) = min(400, 1250) = 400
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 25000,
          grossPayrollMonthlyEstimated: 25000,
          costCapPercentage: 0.05,
          employeeCostActual: 200,
          employeeCostEstimated: 200,
          employerCostActual: 400,
          employerCostEstimated: 400,
        })

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("400.0000")
      })

      test("when there are wage enhancements, includes them with EI/CPP/WCB rate", async () => {
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

        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // 20 hours * $10/hour = $200 subtotal
        // With EI/CPP/WCB (0.14): $200 * 1.14 = $228
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
          employeeName: "John Doe",
          hoursEstimated: 20,
          hoursActual: 20,
        })

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("228.0000")
      })

      test("when there are multiple wage enhancements, sums them correctly", async () => {
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

        const employeeWageTier1 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 2,
          tierLabel: "Level 1a",
          wageRatePerHour: 6.0,
        })

        const employeeWageTier2 = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // First enhancement: 10 hours * $6/hour = $60
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier1.id,
          employeeName: "Alice Smith",
          hoursEstimated: 10,
          hoursActual: 10,
        })

        // Second enhancement: 15 hours * $10/hour = $150
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier2.id,
          employeeName: "Bob Jones",
          hoursEstimated: 15,
          hoursActual: 15,
        })

        // Subtotal: $60 + $150 = $210
        // With EI/CPP/WCB: $210 * 1.14 = $239.40

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("239.4000")
      })

      test("when there are both employee benefits and wage enhancements, combines them correctly", async () => {
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

        // Employee benefit: min(100, 10000 * 0.02) = min(100, 200) = 100
        await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          grossPayrollMonthlyActual: 10000,
          grossPayrollMonthlyEstimated: 10000,
          costCapPercentage: 0.02,
          employeeCostActual: 50,
          employeeCostEstimated: 50,
          employerCostActual: 100,
          employerCostEstimated: 100,
        })

        const employeeWageTier = await employeeWageTierFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          tierLevel: 3,
          tierLabel: "Level 2",
          wageRatePerHour: 10.0,
        })

        // Wage enhancement: 20 hours * $10/hour * 1.14 = $228
        await wageEnhancementFactory.create({
          centreId: centre.id,
          employeeWageTierId: employeeWageTier.id,
          employeeName: "Jane Doe",
          hoursEstimated: 20,
          hoursActual: 20,
        })

        // Total: $100 + $228 = $328

        // Act
        const result = await CalculatePayrollAdjustmentsPeriodAmountService.perform(
          centre.id,
          fiscalPeriod.id
        )

        // Assert
        expect(result).toBe("328.0000")
      })
    })
  })
})
