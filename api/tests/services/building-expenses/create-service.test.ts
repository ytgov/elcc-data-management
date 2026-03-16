import { BuildingExpense } from "@/models"

import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
  userFactory,
} from "@/factories"

import CreateService from "@/services/building-expenses/create-service"

describe("api/src/services/building-expenses/create-service.ts", () => {
  describe("CreateService", () => {
    describe(".perform", () => {
      test("when applyToCurrentAndFutureFiscalPeriods is true, creates matching building expenses forward for the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create({
          region: "Test Region",
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "80",
        })
        const category = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          subsidyRate: "0.5000",
        })
        const fundingPeriod1 = await fundingPeriodFactory.create({
          fiscalYear: "2099-2100",
          fromDate: new Date("2099-04-01T00:00:00Z"),
          toDate: new Date("2100-03-31T23:59:59Z"),
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: new Date("2099-04-01T00:00:00Z"),
          dateEnd: new Date("2099-04-30T23:59:59Z"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: new Date("2099-05-01T00:00:00Z"),
          dateEnd: new Date("2099-05-31T23:59:59Z"),
        })
        const fiscalPeriod3 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: new Date("2099-06-01T00:00:00Z"),
          dateEnd: new Date("2099-06-30T23:59:59Z"),
        })

        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod3.id,
          categoryId: category.id,
        })

        // Act
        await CreateService.perform(
          {
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            categoryId: category.id,
            estimatedCost: "120.0000",
            actualCost: "100.0000",
            totalCost: "0",
            notes: "Apply forward",
            applyToCurrentAndFutureFiscalPeriods: true,
          },
          currentUser
        )

        // Assert
        const buildingExpenses = await BuildingExpense.findAll({
          where: {
            centreId: centre.id,
            categoryId: category.id,
          },
          order: [["fiscalPeriodId", "ASC"]],
        })

        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            fiscalPeriodId: fiscalPeriod1.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Apply forward",
          }),
          expect.objectContaining({
            fiscalPeriodId: fiscalPeriod2.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Apply forward",
          }),
          expect.objectContaining({
            fiscalPeriodId: fiscalPeriod3.id,
          }),
        ])
      })
    })
  })
})
