import { Transaction } from "sequelize"

import { Centre } from "@/models"
import { LogOperationTypes } from "@/models/log"
import { CentreServices } from "@/services"

import { LogServices } from "@/services/log-services" // import separately for easier mocking.

import { userFactory } from "@/factories"

vi.mock("@/services/log-services")

describe("api/src/services/centre-services.ts", () => {
  describe("CentreServices", () => {
    describe(".create", () => {
      test("creates a new centre in the database", async () => {
        const currentUser = userFactory.build()
        const attributes = {
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          region: Centre.Regions.WHITEHORSE,
          isFirstNationProgram: false,
          status: "Up to date",
          hotMeal: false,
          licensedFor: null,
          lastSubmission: new Date("2023-09-11"),
        }

        const centre = await CentreServices.create(attributes, { currentUser })

        expect(centre).toBeInstanceOf(Centre)
        expect(
          await Centre.count({
            where: {
              name: "Reba",
              license: "ECLC-438361",
              community: "Destruction Bay",
              region: Centre.Regions.WHITEHORSE,
              isFirstNationProgram: false,
              status: "Up to date",
              hotMeal: false,
              licensedFor: null,
              lastSubmission: "2023-09-11", // OR new Date("2023-09-11").toISOString().split("T")[0]
            },
          })
        ).toBe(1)
      })

      test("calls the LogService.create method with the appropriate arguments", async () => {
        const currentUser = userFactory.build()
        const attributes = {
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          region: Centre.Regions.WHITEHORSE,
          isFirstNationProgram: false,
          status: "Up to date",
          hotMeal: false,
          licensedFor: null,
          lastSubmission: new Date("2023-09-11"),
        }

        const centre = await CentreServices.create(attributes, { currentUser })

        expect(LogServices.create).toHaveBeenCalledWith({
          model: centre,
          currentUser,
          operation: LogOperationTypes.CREATE,
          transaction: expect.any(Transaction),
        })
      })
    })
  })
})
