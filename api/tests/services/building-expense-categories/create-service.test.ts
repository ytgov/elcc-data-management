import { DateTime } from "luxon"

import { BuildingExpense } from "@/models"

import {
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
  userFactory,
} from "@/factories"

import CreateService from "@/services/building-expense-categories/create-service"

describe("api/src/services/building-expense-categories/create-service.ts", () => {
  describe("CreateService", () => {
    describe(".perform", () => {
      test("when valid attributes are provided, creates the category", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const matchingFundingRegion = await fundingRegionFactory.create({
          region: "Matching Region",
        })

        // Act
        const buildingExpenseCategory = await CreateService.perform(
          {
            fundingRegionId: matchingFundingRegion.id,
            categoryName: "Shared Insurance",
            subsidyRate: "0.3300",
          },
          currentUser
        )

        // Assert
        expect(buildingExpenseCategory).toEqual(
          expect.objectContaining({
            fundingRegionId: matchingFundingRegion.id,
            categoryName: "Shared Insurance",
            subsidyRate: "0.33",
          })
        )
      })

      test("when applyToCurrentAndFutureCentreFundingPeriods is true, creates matching building expenses forward", async () => {
        // Arrange
        const currentMonthStart = DateTime.now().startOf("month")
        const nextMonthStart = currentMonthStart.plus({ months: 1 })
        const currentFundingPeriodStartYear = currentMonthStart.year
        const currentFundingPeriodEndYear = currentMonthStart.plus({ years: 1 }).year
        const currentFundingPeriodFiscalYear = `${currentFundingPeriodStartYear}-${currentFundingPeriodEndYear}`
        const currentMonthEnd = currentMonthStart.endOf("month").set({ millisecond: 0 })
        const nextMonthEnd = nextMonthStart.endOf("month").set({ millisecond: 0 })
        const currentUser = await userFactory.create()
        const matchingFundingRegion = await fundingRegionFactory.create({
          region: "Matching Region",
        })
        const matchingCentre = await centreFactory.create({
          fundingRegionId: matchingFundingRegion.id,
          buildingUsagePercent: "75.00",
        })

        const currentFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: currentFundingPeriodFiscalYear,
        })
        const currentFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: currentMonthStart.toJSDate(),
          dateEnd: currentMonthEnd.toJSDate(),
        })
        const nextFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: nextMonthStart.toJSDate(),
          dateEnd: nextMonthEnd.toJSDate(),
        })

        // Act
        const buildingExpenseCategory = await CreateService.perform(
          {
            fundingRegionId: matchingFundingRegion.id,
            categoryName: "Shared Insurance",
            subsidyRate: "0.3300",
            applyToCurrentAndFutureCentreFundingPeriods: true,
          },
          currentUser
        )

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: matchingCentre.id,
            fiscalPeriodId: currentFiscalPeriod.id,
            categoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot: "Matching Region",
            subsidyRate: "0.33",
            buildingUsagePercent: "75",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
            notes: null,
          }),
          expect.objectContaining({
            centreId: matchingCentre.id,
            fiscalPeriodId: nextFiscalPeriod.id,
            categoryId: buildingExpenseCategory.id,
            fundingRegionSnapshot: "Matching Region",
            subsidyRate: "0.33",
            buildingUsagePercent: "75",
            estimatedCost: "0",
            actualCost: "0",
            totalCost: "0",
            notes: null,
          }),
        ])
      })

      test("when applyToCurrentAndFutureCentreFundingPeriods is not provided, does not create building expenses", async () => {
        // Arrange
        const currentMonthStart = DateTime.now().startOf("month")
        const nextMonthStart = currentMonthStart.plus({ months: 1 })
        const currentFundingPeriodStartYear = currentMonthStart.year
        const currentFundingPeriodEndYear = currentMonthStart.plus({ years: 1 }).year
        const currentFundingPeriodFiscalYear = `${currentFundingPeriodStartYear}-${currentFundingPeriodEndYear}`
        const currentMonthEnd = currentMonthStart.endOf("month").set({ millisecond: 0 })
        const nextMonthEnd = nextMonthStart.endOf("month").set({ millisecond: 0 })
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create({
          region: "Silent Region",
        })
        await centreFactory.create({
          fundingRegionId: fundingRegion.id,
          buildingUsagePercent: "82.00",
        })
        const currentFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: currentFundingPeriodFiscalYear,
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: currentMonthStart.toJSDate(),
          dateEnd: currentMonthEnd.toJSDate(),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: nextMonthStart.toJSDate(),
          dateEnd: nextMonthEnd.toJSDate(),
        })

        // Act
        await CreateService.perform(
          {
            fundingRegionId: fundingRegion.id,
            categoryName: "Manual Only",
            subsidyRate: "0.2500",
          },
          currentUser
        )

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([])
      })
    })
  })
})
