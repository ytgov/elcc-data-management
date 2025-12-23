import {
  BuildingExpense,
  Centre,
  EmployeeBenefit,
  FundingReconciliation,
  FundingReconciliationAdjustment,
  FundingSubmissionLineJson,
  Log,
} from "@/models"

import {
  buildingExpenseCategoryFactory,
  fundingRegionFactory,
  userFactory,
} from "@/factories"

import CreateService from "@/services/centres/create-service"
import FundingPeriodsCreateService from "@/services/funding-periods/create-service"

describe("api/src/services/centres/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      beforeEach(async () => {
        await FundingPeriodsCreateService.perform({
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
          title: "2025-2026",
        })
      })

      test("when provided with valid attributes, creates a centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

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

      test("when status is not provided, defaults to ACTIVE", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: true,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        expect(centre.status).toEqual(Centre.Statuses.ACTIVE)
      })

      test("when centre created, logs creation event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

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

      test("when centre created, creates employee benefits for all fiscal periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: false,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const employeeBenefitsCount = await EmployeeBenefit.count({
          where: { centreId: centre.id },
        })
        expect(employeeBenefitsCount).toEqual(12)
      })

      test("when centre created, creates building expenses for all fiscal periods and categories", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: false,
          buildingUsagePercent: "75",
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const buildingExpensesCount = await BuildingExpense.count({
          where: { centreId: centre.id },
        })
        expect(buildingExpensesCount).toEqual(24) // 12 fiscal periods × 2 categories
      })

      test("when centre created, creates funding submission line jsons for all months", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: false,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll({
          where: { centreId: centre.id },
        })
        expect(fundingSubmissionLineJsons.length).toEqual(12) // 12 months
      })

      test("when centre created, creates funding reconciliations for all funding periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: false,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const fundingReconciliationsCount = await FundingReconciliation.count({
          where: { centreId: centre.id },
        })
        expect(fundingReconciliationsCount).toEqual(1)
      })

      test("when centre created, creates funding reconciliation adjustments for all funding periods and fiscal periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.createList(2, {
          fundingRegionId: fundingRegion.id,
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Test Centre",
          license: "ECLC-12345",
          community: "Whitehorse",
          isFirstNationProgram: false,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        const fundingReconciliationAdjustmentsCount = await FundingReconciliationAdjustment.count({
          include: [
            {
              association: "fundingReconciliation",
              where: { centreId: centre.id },
            },
          ],
        })
        expect(fundingReconciliationAdjustmentsCount).toEqual(12) // 1 funding period × 12 fiscal periods
      })
    })
  })
})
