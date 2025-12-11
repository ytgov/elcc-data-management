import { EmployeeBenefit } from "@/models"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkCreateForCentreService from "@/services/employee-benefits/bulk-create-for-centre-service"

describe("api/src/services/employee-benefits/bulk-create-for-centre-service.ts", () => {
  describe("BulkCreateForCentreService", () => {
    describe("#perform", () => {
      test("when provided with a centre, and there is an existing funding period with fiscal periods, creates employee benefits for all fiscal periods", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
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
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await BulkCreateForCentreService.perform(centre)

        // Assert
        const employeeBenefitsCount = await EmployeeBenefit.count({
          where: { centreId: centre.id },
        })
        expect(employeeBenefitsCount).toEqual(3)
      })
    })
  })
})
