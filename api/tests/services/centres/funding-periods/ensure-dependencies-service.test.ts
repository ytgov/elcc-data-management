import {
  BuildingExpense,
  EmployeeBenefit,
  FundingReconciliation,
  FundingSubmissionLineJson,
} from "@/models"

import {
  buildingExpenseCategoryFactory,
  centreFactory,
  fiscalPeriodFactory,
  fundingPeriodFactory,
  fundingRegionFactory,
  fundingSubmissionLineFactory,
} from "@/factories"

import EnsureDependenciesService from "@/services/centres/funding-periods/ensure-dependencies-service"

describe("api/src/services/centres/funding-periods/ensure-dependencies-service.ts", () => {
  describe("EnsureDependenciesService", () => {
    describe("#perform", () => {
      test("delegates to EnsureChildrenService, creating all child records", async () => {
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
        await EnsureDependenciesService.perform(centre, fundingPeriod)

        // Assert
        const employeeBenefitCount = await EmployeeBenefit.count({
          where: { centreId: centre.id },
        })
        const buildingExpenseCount = await BuildingExpense.count({
          where: { centreId: centre.id },
        })
        const fundingSubmissionLineJsonCount = await FundingSubmissionLineJson.count({
          where: { centreId: centre.id },
        })
        const fundingReconciliationCount = await FundingReconciliation.count({
          where: { centreId: centre.id, fundingPeriodId: fundingPeriod.id },
        })

        expect(employeeBenefitCount).toBeGreaterThan(0)
        expect(buildingExpenseCount).toBeGreaterThan(0)
        expect(fundingSubmissionLineJsonCount).toBeGreaterThan(0)
        expect(fundingReconciliationCount).toBeGreaterThan(0)
      })
    })
  })
})
