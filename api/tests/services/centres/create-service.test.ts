import { Log } from "@/models"

import { fundingRegionFactory, userFactory } from "@/factories"

import CreateService from "@/services/centres/create-service"

describe("api/src/services/centres/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when provided with valid attributes, creates a centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          isFirstNationProgram: false,
          status: "Up to date",
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        expect(centre).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            fundingRegionId: fundingRegion.id,
            name: "Reba",
            license: "ECLC-438361",
            community: "Destruction Bay",
            isFirstNationProgram: false,
            status: "Up to date",
          })
        )
      })

      test("when centre created, logs creation event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          isFirstNationProgram: false,
          status: "Up to date",
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const logs = await Log.findAll()
        expect(logs).toEqual([
          expect.objectContaining({
            operation: Log.OperationTypes.CREATE,
            tableName: "centres",
            userEmail: currentUser.email,
            data: JSON.stringify(centre),
          }),
        ])
      })
    })
  })
})
