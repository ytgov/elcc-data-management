import { DateTime } from "luxon"

import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
} from "@/factories"
import { BuildingExpense } from "@/models"

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

        const previousFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: `${previousMonthStart.year}-${previousMonthStart.plus({ years: 1 }).year}`,
        })
        const currentFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: `${currentMonthStart.year}-${currentMonthStart.plus({ years: 1 }).year}`,
        })

        const previousFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: previousFundingPeriod.id,
          dateStart: previousMonthStart.startOf("month").toJSDate(),
          dateEnd: previousMonthStart.endOf("month").set({ millisecond: 0 }).toJSDate(),
        })
        const currentFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: currentMonthStart.startOf("month").toJSDate(),
          dateEnd: currentMonthStart.endOf("month").set({ millisecond: 0 }).toJSDate(),
        })
        const nextFiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: currentFundingPeriod.id,
          dateStart: nextMonthStart.startOf("month").toJSDate(),
          dateEnd: nextMonthStart.endOf("month").set({ millisecond: 0 }).toJSDate(),
        })

        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: matchingFundingRegion.id,
          categoryName: "Free Lunch",
        })
        await buildingExpenseCategory.update({
          subsidyRate: "0.3700",
        })

        await buildingExpenseFactory.create({
          centreId: matchingCentre.id,
          fiscalPeriodId: currentFiscalPeriod.id,
          categoryId: buildingExpenseCategory.id,
          fundingRegionSnapshot: "Matching Region",
          subsidyRate: "0.3700",
          buildingUsagePercent: "75.00",
          estimatedCost: "0.0000",
          actualCost: "0.0000",
          totalCost: "0.0000",
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
        const buildingExpenses = await BuildingExpense.findAll({
          where: {
            categoryId: buildingExpenseCategory.id,
          },
          order: [
            ["centreId", "ASC"],
            ["fiscalPeriodId", "ASC"],
          ],
        })

        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: matchingCentre.id,
            fiscalPeriodId: currentFiscalPeriod.id,
          }),
          expect.objectContaining({
            centreId: matchingCentre.id,
            fiscalPeriodId: nextFiscalPeriod.id,
            fundingRegionSnapshot: "Matching Region",
            subsidyRate: "0.3700",
            buildingUsagePercent: "75.00",
            estimatedCost: "0.0000",
            actualCost: "0.0000",
            totalCost: "0.0000",
          }),
          expect.objectContaining({
            centreId: otherCentre.id,
            fiscalPeriodId: nextFiscalPeriod.id,
          }),
        ])

        expect(buildingExpenses.map(({ fiscalPeriodId }) => fiscalPeriodId)).not.toContain(
          previousFiscalPeriod.id
        )
      })
    })
  })
})
