import { EmployeeBenefit } from "@/models"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkCreateService from "@/services/centres/funding-periods/employee-benefits/bulk-create-service"

describe("api/src/services/centres/funding-periods/employee-benefits/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when provided with a centre and funding period, creates employee benefits for all fiscal periods", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
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
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        const employeeBenefits = await BulkCreateService.perform(centre, fundingPeriod)

        // Assert
        expect(employeeBenefits).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            grossPayrollMonthlyActual: "0",
            grossPayrollMonthlyEstimated: "0",
            costCapPercentage: EmployeeBenefit.DEFAULT_COST_CAP_PERCENTAGE,
            employeeCostActual: "0",
            employeeCostEstimated: "0",
            employerCostActual: "0",
            employerCostEstimated: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            grossPayrollMonthlyActual: "0",
            grossPayrollMonthlyEstimated: "0",
            costCapPercentage: EmployeeBenefit.DEFAULT_COST_CAP_PERCENTAGE,
            employeeCostActual: "0",
            employeeCostEstimated: "0",
            employerCostActual: "0",
            employerCostEstimated: "0",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod3.id,
            grossPayrollMonthlyActual: "0",
            grossPayrollMonthlyEstimated: "0",
            costCapPercentage: EmployeeBenefit.DEFAULT_COST_CAP_PERCENTAGE,
            employeeCostActual: "0",
            employeeCostEstimated: "0",
            employerCostActual: "0",
            employerCostEstimated: "0",
          }),
        ])
      })

      test("when no fiscal periods exist for the funding period, errors informatively", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act & Assert
        await expect(BulkCreateService.perform(centre, fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for the given funding period"
        )
      })
    })
  })
})
