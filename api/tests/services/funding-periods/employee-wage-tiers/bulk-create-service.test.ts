import { EmployeeWageTier } from "@/models"
import { fiscalPeriodFactory, fundingPeriodFactory } from "@/factories"

import BulkCreateService from "@/services/funding-periods/employee-wage-tiers/bulk-create-service"

describe("api/src/services/funding-periods/employee-wage-tiers/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when fiscal periods exist, creates employee wage tiers for all tiers and fiscal periods", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-04-01"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
          dateStart: new Date("2024-05-01"),
        })

        // Act
        await BulkCreateService.perform(fundingPeriod)

        // Assert
        const employeeWageTiersCount = await EmployeeWageTier.count()
        expect(employeeWageTiersCount).toEqual(14)
      })

      test("when no fiscal periods exist, errors informatively", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })

        // Act & Assert
        await expect(BulkCreateService.perform(fundingPeriod)).rejects.toThrow(
          "No fiscal periods found for funding period."
        )
      })
    })
  })
})
