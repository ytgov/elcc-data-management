import { Centre } from "@/models"
import { CentreServices } from "@/services"

import { userFactory } from "@/factories"

describe("api/src/services/centre-services.ts", () => {
  describe("CentreServices", () => {
    describe(".create", () => {
      test("creates a new centre in the database", async () => {
        const currentUser = userFactory.build()
        // const { dataValues: attributes } = centreFactory.build()

        const attributes = {
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          status: "Up to date",
          hotMeal: false,
          licensedFor: null,
          lastSubmission: new Date("2023-09-11"),
        }

        expect(await Centre.count()).toBe(0)

        const centre = await CentreServices.create(attributes, { currentUser })

        expect(centre).toBeInstanceOf(Centre)
        expect(
          await Centre.count({
            where: {
              name: "Reba",
              license: "ECLC-438361",
              community: "Destruction Bay",
              status: "Up to date",
              hotMeal: false,
              licensedFor: null,
              lastSubmission: "2023-09-11", // OR new Date("2023-09-11").toISOString().split("T")[0]
            },
          })
        ).toBe(1)
      })
    })
  })
})
