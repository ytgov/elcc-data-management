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
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
  fundingSubmissionLineFactory,
  userFactory,
} from "@/factories"

import CreateService from "@/services/centres/create-service"

describe("api/src/services/centres/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when provided with valid attributes, creates a centre", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
        })

        const attributes = {
          fundingRegionId: fundingRegion.id,
          name: "Reba",
          license: "ECLC-438361",
          community: "Destruction Bay",
          isFirstNationProgram: false,
        }

        // Act
        const centre = await CreateService.perform(attributes, currentUser)

        // Assert
        expect(centre).toEqual(
          expect.objectContaining({
            fundingRegionId: fundingRegion.id,
            name: "Reba",
            license: "ECLC-438361",
            community: "Destruction Bay",
            isFirstNationProgram: false,
            status: Centre.Statuses.ACTIVE,
          })
        )
      })

      test("when centre created, logs creation event", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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

      test("when centre created, creates employee benefits for funding period's fiscal periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-05-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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
        const employeeBenefits = await EmployeeBenefit.findAll()
        expect(employeeBenefits).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod1.id,
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod2.id,
          }),
        ])
      })

      test("when centre created, creates building expenses for funding period's fiscal periods and expense categories", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        const buildingExpenseCategory1 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const buildingExpenseCategory2 = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-05-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            buildingExpenseCategoryId: buildingExpenseCategory1.id,
            fiscalPeriodId: fiscalPeriod1.id,
          }),
          expect.objectContaining({
            centreId: centre.id,
            buildingExpenseCategoryId: buildingExpenseCategory2.id,
            fiscalPeriodId: fiscalPeriod1.id,
          }),
          expect.objectContaining({
            centreId: centre.id,
            buildingExpenseCategoryId: buildingExpenseCategory1.id,
            fiscalPeriodId: fiscalPeriod2.id,
          }),
          expect.objectContaining({
            centreId: centre.id,
            buildingExpenseCategoryId: buildingExpenseCategory2.id,
            fiscalPeriodId: fiscalPeriod2.id,
          }),
        ])
      })

      test("when centre created, creates funding submission line jsons for funding period's fiscal periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-05-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2025/26",
          }),
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2025/26",
          }),
        ])
      })

      test("when centre created, creates a funding reconciliation funding period", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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
        const fundingReconciliations = await FundingReconciliation.findAll()
        expect(fundingReconciliations).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fundingPeriodId: fundingPeriod.id,
            status: FundingReconciliation.Statuses.DRAFT,
            fundingReceivedTotalAmount: "0",
            eligibleExpensesTotalAmount: "0",
            payrollAdjustmentsTotalAmount: "0",
            finalBalanceAmount: "0",
          }),
        ])
      })

      test("when centre created, creates funding reconciliation adjustments for funding period's fiscal periods", async () => {
        // Arrange
        const currentUser = await userFactory.create()
        const fundingRegion = await fundingRegionFactory.create()
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })
        const fiscalPeriod1 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-04-01"),
        })
        const fiscalPeriod2 = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2025-26",
          dateStart: new Date("2025-05-01"),
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2025/26",
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
        const fundingReconciliation = await FundingReconciliation.findOne({
          where: {
            fundingPeriodId: fundingPeriod.id,
            centreId: centre.id,
          },
          rejectOnEmpty: true,
        })
        const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.findAll()
        expect(fundingReconciliationAdjustments).toEqual([
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod1.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          }),
          expect.objectContaining({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod2.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          }),
        ])
      })

      describe("time dependent effects", () => {
        beforeEach(() => {
          vi.useFakeTimers()
        })

        afterEach(() => {
          vi.useRealTimers()
        })

        test("when current funding period exists, selects the current funding period", async () => {
          // Arrange
          const currentDate = new Date("2025-04-01")
          vi.setSystemTime(currentDate)

          const currentUser = await userFactory.create()
          const fundingRegion = await fundingRegionFactory.create()
          await buildingExpenseCategoryFactory.create({
            fundingRegionId: fundingRegion.id,
          })
          await fundingPeriodFactory.create({
            fiscalYear: "2024-2025",
            fromDate: new Date("2024-04-01"),
          })
          const currentFundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2025-2026",
            fromDate: new Date("2025-04-01"),
          })
          await fundingPeriodFactory.create({
            fiscalYear: "2026-2027",
            fromDate: new Date("2026-04-01"),
          })

          const fiscalPeriodInCurrentFundingPeriod = await fiscalPeriodFactory.create({
            fundingPeriodId: currentFundingPeriod.id,
            fiscalYear: "2025-26",
            dateStart: new Date("2025-04-01"),
          })
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2025/26",
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
          const employeeBenefits = await EmployeeBenefit.findAll()
          expect(employeeBenefits).toEqual([
            expect.objectContaining({
              centreId: centre.id,
              fiscalPeriodId: fiscalPeriodInCurrentFundingPeriod.id,
            }),
          ])
        })

        test("when funding period for current date does not exist, selects the newest valid funding period", async () => {
          // Arrange
          // Arrange
          const currentDate = new Date("2025-04-01")
          vi.setSystemTime(currentDate)

          const currentUser = await userFactory.create()
          const fundingRegion = await fundingRegionFactory.create()
          await buildingExpenseCategoryFactory.create({
            fundingRegionId: fundingRegion.id,
          })
          const newestPastFundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2024-2025",
            fromDate: new Date("2024-04-01"),
          })

          await fundingPeriodFactory.create({
            fiscalYear: "2026-2027",
            fromDate: new Date("2026-04-01"),
          })

          const fiscalPeriodInNewestPastFundingPeriod = await fiscalPeriodFactory.create({
            fundingPeriodId: newestPastFundingPeriod.id,
            fiscalYear: "2024-25",
            dateStart: new Date("2024-04-01"),
          })
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2024/25",
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
          const employeeBenefits = await EmployeeBenefit.findAll()
          expect(employeeBenefits).toEqual([
            expect.objectContaining({
              centreId: centre.id,
              fiscalPeriodId: fiscalPeriodInNewestPastFundingPeriod.id,
            }),
          ])
        })
      })
    })
  })
})
