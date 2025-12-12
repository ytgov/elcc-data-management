import { Log } from "@/models"

import { centreFactory, userFactory } from "@/factories"

import UpdateService from "@/services/centres/update-service"

describe("api/src/services/centres/update-service.ts", () => {
  describe("UpdateService", () => {
    describe("#perform", () => {
      test("when provided with valid attributes, updates the centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create({
          name: "Original name",
          status: "Up to date",
        })

        const attributes = {
          name: "Updated name",
          status: "Inactive",
        }

        // Act
        const updatedCentre = await UpdateService.perform(centre, attributes, currentUser)

        // Assert
        expect(updatedCentre).toEqual(
          expect.objectContaining({
            id: centre.id,
            name: "Updated name",
            status: "Inactive",
          })
        )
      })

      test("when centre updated, logs update event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const centre = await centreFactory.create({
          name: "Original name",
        })

        const attributes = {
          name: "Updated name",
        }

        // Act
        await UpdateService.perform(centre, attributes, currentUser)

        // Assert
        const logs = await Log.findAll()
        expect(logs).toEqual([
          expect.objectContaining({
            operation: Log.OperationTypes.UPDATE,
            tableName: "centres",
            userEmail: currentUser.email,
            data: JSON.stringify(centre),
          }),
        ])
      })
    })
  })
})
