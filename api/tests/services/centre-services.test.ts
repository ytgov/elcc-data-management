import { Centre, Log } from "@/models"
import { CentreServices } from "@/services"

import { centreFactory, userFactory } from "@/factories"

describe("api/src/services/centre-services.ts", () => {
  describe("CentreServices", () => {
    describe(".create", () => {
      test("creates a new centre in the database", async () => {
        const currentUser = userFactory.build()
        // const { dataValues: attributes } = centreFactory.build()

        const attributes = {
          id: 1,
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          status: "Up to date",
          hotMeal: false,
          licensedFor: null,
          lastSubmission: new Date("2023-09-11"),
          createDate: new Date("2023-07-08T00:08:18.953Z"),
        }

        console.log("attributes", JSON.stringify(attributes, null, 2))

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
              // lastSubmission: new Date("2023-09-11"),
              // createDate: new Date("2023-07-08T00:08:18.000Z"),
            },
          })
        ).toBe(1)
      })
    })
  })
})
