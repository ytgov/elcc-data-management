import {
  BuildingExpense,
  EmployeeBenefit,
  FundingReconciliation,
  FundingSubmissionLineJson,
} from "@/models"

import {
  buildingExpenseCategoryFactory,
  buildingExpenseFactory,
  centreFactory,
  employeeBenefitFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingReconciliationFactory,
  fundingRegionFactory,
  fundingSubmissionLineFactory,
  fundingSubmissionLineJsonFactory,
} from "@/factories"

import EnsureChildrenService from "@/services/centres/funding-periods/ensure-children-service"

describe("api/src/services/centres/funding-periods/ensure-children-service.ts", () => {
  describe("EnsureChildrenService", () => {
    describe("#perform", () => {
      test("when centre has no employee benefits, creates an employee benefit per fiscal period", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const employeeBenefits = await EmployeeBenefit.findAll()
        expect(employeeBenefits).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
          }),
        ])
      })

      test("when centre has employee benefits, does not create duplicate employee benefits", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        const employeeBenefit = await employeeBenefitFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const employeeBenefits = await EmployeeBenefit.findAll()
        expect(employeeBenefits).toEqual([
          expect.objectContaining({
            id: employeeBenefit.id,
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
          }),
        ])
      })

      test("when centre has no building expenses, creates building expenses per building expense category", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            buildingExpenseCategoryId: buildingExpenseCategory.id,
          }),
        ])
      })

      test("when centre has building expenses, does not create duplicate building expenses", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        const fiscalPeriod = await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        const buildingExpenseCategory = await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const buildingExpense = await buildingExpenseFactory.create({
          centreId: centre.id,
          fiscalPeriodId: fiscalPeriod.id,
          buildingExpenseCategoryId: buildingExpenseCategory.id,
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const buildingExpenses = await BuildingExpense.findAll()
        expect(buildingExpenses).toEqual([
          expect.objectContaining({
            id: buildingExpense.id,
            centreId: centre.id,
            fiscalPeriodId: fiscalPeriod.id,
            buildingExpenseCategoryId: buildingExpenseCategory.id,
          }),
        ])
      })

      test("when centre has no funding submission line jsons, creates some funding submission line jsons", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fiscalYear: "2024/25",
          }),
        ])
      })

      test("when centre has funding submission line jsons, does not create duplicate funding submission line jsons", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        const fundingSubmissionLineJson = await fundingSubmissionLineJsonFactory.create({
          centreId: centre.id,
          fiscalYear: "2024/25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll()
        expect(fundingSubmissionLineJsons).toEqual([
          expect.objectContaining({
            id: fundingSubmissionLineJson.id,
            centreId: centre.id,
            fiscalYear: "2024/25",
          }),
        ])
      })

      test("when centre has no funding reconciliation, creates a funding reconciliation", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const fundingReconciliations = await FundingReconciliation.findAll()
        expect(fundingReconciliations).toEqual([
          expect.objectContaining({
            centreId: centre.id,
            fundingPeriodId: fundingPeriod.id,
          }),
        ])
      })

      test("when centre has funding reconciliation, does not create duplicate", async () => {
        // Arrange
        const fundingRegion = await fundingRegionFactory.create()
        const centre = await centreFactory.create({
          fundingRegionId: fundingRegion.id,
        })
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fiscalPeriodFactory.create({
          fundingPeriodId: fundingPeriod.id,
          fiscalYear: "2024-25",
        })
        const fundingReconciliation = await fundingReconciliationFactory.create({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
        })
        await buildingExpenseCategoryFactory.create({
          fundingRegionId: fundingRegion.id,
        })

        // Act
        await EnsureChildrenService.perform(centre, fundingPeriod)

        // Assert
        const fundingReconciliations = await FundingReconciliation.findAll()
        expect(fundingReconciliations).toEqual([
          expect.objectContaining({
            id: fundingReconciliation.id,
            centreId: centre.id,
            fundingPeriodId: fundingPeriod.id,
          }),
        ])
      })
    })
  })
})
