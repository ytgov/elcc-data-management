import { Centre } from "@/models"
import { CentreServices } from "@/services"

import { centreFactory, userFactory } from "@/factories"

describe("api/src/services/centre-services.ts", () => {
  describe("CentreServices", () => {
    describe(".create", () => {
      test("creates a new centre in the database", () => {
        expect.assertions(2)
        const currentUser = userFactory.build()
        const centerAttributes = centreFactory.build()
        return CentreServices.create(centerAttributes, { currentUser }).then((centre) => {
          expect(centre).toBeInstanceOf(Centre)
          expect(centre).toMatchObject(centerAttributes)
        })
      })
    })
  })
})
