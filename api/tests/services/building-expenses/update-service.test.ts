import { DateTime } from "luxon"

import {
  buildingExpenseFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  userFactory,
} from "@/factories"

import UpdateService from "@/services/building-expenses/update-service"

describe("api/src/services/building-expenses/update-service.ts", () => {
  describe("UpdateService", () => {
    describe(".perform", () => {
      test("when building expense is in a current or future fiscal period, updates it", async () => {
        // Arrange
        const fiscalPeriodStart = DateTime.fromISO("2099-04-01T00:00:00Z")
        const currentUser = await userFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2099-2100",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2099-00",
          dateStart: fiscalPeriodStart.toJSDate(),
          dateEnd: fiscalPeriodStart.endOf("month").set({ millisecond: 0 }).toJSDate(),
        })
        const buildingExpense = await buildingExpenseFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          estimatedCost: "100.0000",
          actualCost: "100.0000",
          totalCost: "50.0000",
          notes: "Before update",
        })

        // Act
        const result = await UpdateService.perform(
          buildingExpense,
          {
            estimatedCost: "125.0000",
            actualCost: "110.0000",
            notes: "After update",
          },
          currentUser
        )

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            estimatedCost: "125.0000",
            actualCost: "110.0000",
            notes: "After update",
          })
        )
      })

      test("when building expense is in a past fiscal period, errors informatively", async () => {
        // Arrange
        const fiscalPeriodStart = DateTime.fromISO("2020-04-01T00:00:00Z")
        const currentUser = await userFactory.create()
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2020-2021",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2020-21",
          dateStart: fiscalPeriodStart.toJSDate(),
          dateEnd: fiscalPeriodStart.endOf("month").set({ millisecond: 0 }).toJSDate(),
        })
        const buildingExpense = await buildingExpenseFactory.create({
          fiscalPeriodId: fiscalPeriod.id,
          estimatedCost: "100.0000",
          notes: "Before update",
        })

        // Act
        await expect(
          UpdateService.perform(
            buildingExpense,
            {
              estimatedCost: "125.0000",
              notes: "After update",
            },
            currentUser
          )
        ).rejects.toThrow("Cannot update building expense for a past fiscal period")
      })
    })
  })
})
