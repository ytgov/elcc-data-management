import { DateTime } from "luxon"

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
      test("when valid attributes are provided, creates a building expense", async () => {
        // Arrange
        const fiscalPeriodStart = DateTime.fromISO("2099-04-01T00:00:00Z")
        const fiscalPeriodEnd = fiscalPeriodStart.endOf("month").set({ millisecond: 0 })
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
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2099-2100",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: fiscalPeriodStart.toJSDate(),
          dateEnd: fiscalPeriodEnd.toJSDate(),
        })

        // Act
        const buildingExpense = await CreateService.perform(
          {
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            categoryId: category.id,
            estimatedCost: "120.0000",
            actualCost: "100.0000",
            totalCost: "0",
            notes: "Base create",
          },
          currentUser
        )

        // Assert
        expect(buildingExpense).toEqual(
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            categoryId: category.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Base create",
          })
        )
      })

      test("when applyToCurrentAndFutureFiscalPeriods is true, creates matching building expenses forward for the centre", async () => {
        // Arrange
        const fundingPeriodStart = DateTime.fromISO("2099-04-01T00:00:00Z")
        const firstFiscalPeriodStart = fundingPeriodStart
        const secondFiscalPeriodStart = firstFiscalPeriodStart.plus({ months: 1 })
        const thirdFiscalPeriodStart = secondFiscalPeriodStart.plus({ months: 1 })
        const fundingPeriodEnd = fundingPeriodStart.plus({ years: 1 }).minus({ second: 1 })
        const firstFiscalPeriodEnd = firstFiscalPeriodStart.endOf("month").set({ millisecond: 0 })
        const secondFiscalPeriodEnd = secondFiscalPeriodStart.endOf("month").set({ millisecond: 0 })
        const thirdFiscalPeriodEnd = thirdFiscalPeriodStart.endOf("month").set({ millisecond: 0 })
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
          fromDate: fundingPeriodStart.toJSDate(),
          toDate: fundingPeriodEnd.toJSDate(),
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: firstFiscalPeriodStart.toJSDate(),
          dateEnd: firstFiscalPeriodEnd.toJSDate(),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: secondFiscalPeriodStart.toJSDate(),
          dateEnd: secondFiscalPeriodEnd.toJSDate(),
        })
        const fiscalPeriod3 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod1.id,
          fiscalYear: "2099-00",
          dateStart: thirdFiscalPeriodStart.toJSDate(),
          dateEnd: thirdFiscalPeriodEnd.toJSDate(),
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
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod3.id,
            categoryId: category.id,
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            categoryId: category.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Apply forward",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            categoryId: category.id,
            fundingRegionSnapshot: "Test Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Apply forward",
          }),
        ])
      })
    })
  })
})
