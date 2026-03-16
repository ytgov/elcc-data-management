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

import BulkEnsureForwardService from "@/services/building-expenses/fiscal-periods/bulk-ensure-forward-service"

describe("api/src/services/building-expenses/fiscal-periods/bulk-ensure-forward-service.ts", () => {
  describe("BulkEnsureForwardService", () => {
    describe(".perform", () => {
      test("when future fiscal periods are missing matching records, creates them forward", async () => {
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
          region: "North Region",
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "80.00",
        })
        const category = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          subsidyRate: "0.5000",
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2099-2100",
          fromDate: fundingPeriodStart.toJSDate(),
          toDate: fundingPeriodEnd.toJSDate(),
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: firstFiscalPeriodStart.toJSDate(),
          dateEnd: firstFiscalPeriodEnd.toJSDate(),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: secondFiscalPeriodStart.toJSDate(),
          dateEnd: secondFiscalPeriodEnd.toJSDate(),
        })
        const fiscalPeriod3 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: thirdFiscalPeriodStart.toJSDate(),
          dateEnd: thirdFiscalPeriodEnd.toJSDate(),
        })
        const sourceBuildingExpense = await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod1.id,
          categoryId: category.id,
          fundingRegionSnapshot: "North Region",
          subsidyRate: "0.5000",
          buildingUsagePercent: "80.00",
          estimatedCost: "120.0000",
          actualCost: "100.0000",
          totalCost: "40.0000",
          notes: "Copied forward",
        })
        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod3.id,
          categoryId: category.id,
          fundingRegionSnapshot: "North Region",
          subsidyRate: "0.5000",
          buildingUsagePercent: "80.00",
          estimatedCost: "10.0000",
          actualCost: "10.0000",
          totalCost: "4.0000",
          notes: "Existing future record",
        })

        // Act
        await BulkEnsureForwardService.perform(fiscalPeriod1, sourceBuildingExpense, currentUser)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            categoryId: category.id,
            fundingRegionSnapshot: "North Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Copied forward",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod3.id,
            categoryId: category.id,
            fundingRegionSnapshot: "North Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "10",
            actualCost: "10",
            totalCost: "4",
            notes: "Existing future record",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            categoryId: category.id,
            fundingRegionSnapshot: "North Region",
            subsidyRate: "0.5",
            buildingUsagePercent: "80",
            estimatedCost: "120",
            actualCost: "100",
            totalCost: "40",
            notes: "Copied forward",
          }),
        ])
      })

      test("when matching future building expenses already exist, does not create duplicates", async () => {
        // Arrange
        const firstFiscalPeriodStart = DateTime.fromISO("2099-04-01T00:00:00Z")
        const secondFiscalPeriodStart = firstFiscalPeriodStart.plus({ months: 1 })
        const firstFiscalPeriodEnd = firstFiscalPeriodStart.endOf("month").set({ millisecond: 0 })
        const secondFiscalPeriodEnd = secondFiscalPeriodStart.endOf("month").set({ millisecond: 0 })
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create({
          region: "No Duplicate Region",
        })
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "80.00",
        })
        const category = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          subsidyRate: "0.5000",
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2099-2100",
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: firstFiscalPeriodStart.toJSDate(),
          dateEnd: firstFiscalPeriodEnd.toJSDate(),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: secondFiscalPeriodStart.toJSDate(),
          dateEnd: secondFiscalPeriodEnd.toJSDate(),
        })
        const sourceBuildingExpense = await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod1.id,
          categoryId: category.id,
          notes: "Source",
        })
        await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod2.id,
          categoryId: category.id,
          notes: "Already there",
        })

        // Act
        await BulkEnsureForwardService.perform(fiscalPeriod1, sourceBuildingExpense, currentUser)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
            categoryId: category.id,
            notes: "Source",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
            categoryId: category.id,
            notes: "Already there",
          }),
        ])
      })
    })
  })
})
