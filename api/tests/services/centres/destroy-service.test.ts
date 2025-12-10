import { Centre, Log } from "@/models"

import { centreFactory, userFactory } from "@/factories"

import DestroyService from "@/services/centres/destroy-service"

describe("api/src/services/centres/destroy-service.ts", () => {
  describe("DestroyService", () => {
    describe("#perform", () => {
      test("when centre has no dependents, destroys the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const reloadedCentre = await Centre.findByPk(centre.id)
        expect(reloadedCentre).toBeNull()
      })

      test("when centre destroyed, logs delete event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create()

        // Act
        await DestroyService.perform(centre, currentUser)

        // Assert
        const logs = await Log.findAll()
        expect(logs).toEqual([
          expect.objectContaining({
            operation: Log.OperationTypes.DELETE,
            tableName: "centres",
            userEmail: currentUser.email,
            data: JSON.stringify(centre),
          }),
        ])
      })
    })
  })
})
