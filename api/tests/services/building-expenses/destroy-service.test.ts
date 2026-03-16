import { DateTime } from "luxon"

import { BuildingExpense } from "@/models"

import {
  buildingExpenseFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  userFactory,
} from "@/factories"

import DestroyService from "@/services/building-expenses/destroy-service"

describe("api/src/services/building-expenses/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe(".perform", () => {
      test("when building expense is in a current or future fiscal period, destroys it", async () => {
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
        })

        // Act
        await DestroyService.perform(buildingExpense, currentUser)

        // Assert
        const reloadedBuildingExpense = await BuildingExpense.findByPk(buildingExpense.id)
        expect(reloadedBuildingExpense).toBeNull()
      })
    })
  })
})
