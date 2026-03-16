import { DateTime } from "luxon"

import { BuildingExpense } from "@/models"

import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"

import BulkEnsureForwardService from "@/services/building-expense-categories/building-expenses/bulk-ensure-forward-service"

describe("api/src/services/building-expense-categories/building-expenses/bulk-ensure-forward-service.ts", () => {
  describe("BulkEnsureForwardService", () => {
    describe("#perform", () => {
      test("creates missing building expenses for centres in the category funding region from the current month onward", async () => {
        // Arrange
        const matchingFundingRegion = await fundingRegionFactory.create({
          region: "Matching Region",
        })
        const otherFundingRegion = await fundingRegionFactory.create({
          region: "Other Region",
        })

        const matchingCentre = await centreFactory.create({
          fundingRegionId: matchingFundingRegion.id,
        })
        await matchingCentre.update({
          buildingUsagePercent: "75.00",
        })
        const otherCentre = await centreFactory.create({
          fundingRegionId: otherFundingRegion.id,
        })

        const currentMonthStart = DateTime.now().startOf("month")
        const previousMonthStart = currentMonthStart.minus({ months: 1 })
        const nextMonthStart = currentMonthStart.plus({ months: 1 })
        const previousFundingPeriodStartYear = previousMonthStart.year
        const previousFundingPeriodEndYear = previousMonthStart.plus({ years: 1 }).year
        const previousFundingPeriodFiscalYear = `${previousFundingPeriodStartYear}-${previousFundingPeriodEndYear}`
        const currentFundingPeriodStartYear = currentMonthStart.year
        const currentFundingPeriodEndYear = currentMonthStart.plus({ years: 1 }).year
        const currentFundingPeriodFiscalYear = `${currentFundingPeriodStartYear}-${currentFundingPeriodEndYear}`
        const previousMonthEnd = previousMonthStart.endOf("month").set({ millisecond: 0 })
        const currentMonthEnd = currentMonthStart.endOf("month").set({ millisecond: 0 })
        const nextMonthEnd = nextMonthStart.endOf("month").set({ millisecond: 0 })

        const previousFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: previousFundingPeriodFiscalYear,
        })
        const currentFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: currentFundingPeriodFiscalYear,
        })

        await fiscalPeriodFactory.create({
          fundingPeriodId: previousFundingPeriod.id,
          dateStart: previousMonthStart.startOf("month").toJSDate(),
          dateEnd: previousMonthEnd.toJSDate(),
        })
        const currentFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: currentMonthStart.startOf("month").toJSDate(),
          dateEnd: currentMonthEnd.toJSDate(),
        })
        const nextFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: nextMonthStart.startOf("month").toJSDate(),
          dateEnd: nextMonthEnd.toJSDate(),
        })

        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: matchingFundingRegion.id,
          categoryName: "Free Lunch",
        })
        await buildingExpenseCategory.update({
          subsidyRate: "0.3700",
        })

        await buildingExpenseFactory.create({
          centreId: otherCentre.id,
          fiscalPeriodId: nextFiscalPeriod.id,
          categoryId: buildingExpenseCategory.id,
          fundingRegionSnapshot: "Other Region",
          subsidyRate: "0.3700",
          buildingUsagePercent: "55.00",
          estimatedCost: "0.0000",
          actualCost: "0.0000",
          totalCost: "0.0000",
        })

        // Act
        await BulkEnsureForwardService.perform(buildingExpenseCategory)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: otherCentre.id,
            fiscalPeriodId: nextFiscalPeriod.id,
            categoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot: "Other Region",
            subsidyRate: "0.37",
            buildingUsagePercent: "55",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            centreId: matchingCentre.id,
            fiscalPeriodId: currentFiscalPeriod.id,
            categoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot: "Matching Region",
            subsidyRate: "0.37",
            buildingUsagePercent: "75",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
          expect.objectContaining({
            fiscalPeriodId: nextFiscalPeriod.id,
            centreId: matchingCentre.id,
            categoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot: "Matching Region",
            subsidyRate: "0.37",
            buildingUsagePercent: "75",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
          }),
        ])
      })

      test("when only past fiscal periods exist, does not create building expenses", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create({
          region: "Past Only Region",
        })
        await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "75.00",
        })

        const previousMonthStart = DateTime.now().startOf("month").minus({ months: 1 })
        const previousFundingPeriodStartYear = previousMonthStart.year
        const previousFundingPeriodEndYear = previousMonthStart.plus({ years: 1 }).year
        const previousFundingPeriodFiscalYear = `${previousFundingPeriodStartYear}-${previousFundingPeriodEndYear}`
        const previousMonthEnd = previousMonthStart.endOf("month").set({ millisecond: 0 })
        const previousFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: previousFundingPeriodFiscalYear,
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: previousFundingPeriod.id,
          dateStart: previousMonthStart.startOf("month").toJSDate(),
          dateEnd: previousMonthEnd.toJSDate(),
        })

        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
          categoryName: "Past Utilities",
          subsidyRate: "0.3700",
        })

        // Act
        await BulkEnsureForwardService.perform(buildingExpenseCategory)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([])
      })
    })
  })
})
