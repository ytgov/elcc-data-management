import {
  EmployeeBenefit,
  EmployeeWageTier,
  FiscalPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"

import { centreFactory } from "@/factories"

import CreateService from "@/services/funding-periods/create-service"

describe("api/src/services/funding-periods/create-service.ts", () => {
  describe("CreateService", () => {
    describe(".perform", () => {
      test("when valid parameters are provided, creates funding period", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01T00:00:00Z"),
          toDate: new Date("2025-03-31T23:59:59Z"),
          title: "Test Funding Period",
        }

        // Act
        const result = await CreateService.perform(attributes)

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            fiscalYear: "2024-2025",
            fromDate: new Date("2024-04-01T00:00:00Z"),
            toDate: new Date("2025-03-31T23:59:59Z"),
            title: "Test Funding Period",
          })
        )
      })

      test("when creating a funding period, creates appropriate fiscal periods", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01"),
          toDate: new Date("2025-03-31"),
          title: "Test Funding Period with Fiscal Periods",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const fiscalPeriods = await FiscalPeriod.findAll({
          where: {
            fiscalYear: "2024-25",
          },
          order: [["dateStart", "ASC"]],
        })

        expect(fiscalPeriods).toEqual([
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "april",
            dateStart: new Date("2024-04-01T00:00:00Z"),
            dateEnd: new Date("2024-04-30T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "may",
            dateStart: new Date("2024-05-01T00:00:00Z"),
            dateEnd: new Date("2024-05-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "june",
            dateStart: new Date("2024-06-01T00:00:00Z"),
            dateEnd: new Date("2024-06-30T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "july",
            dateStart: new Date("2024-07-01T00:00:00Z"),
            dateEnd: new Date("2024-07-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "august",
            dateStart: new Date("2024-08-01T00:00:00Z"),
            dateEnd: new Date("2024-08-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "september",
            dateStart: new Date("2024-09-01T00:00:00Z"),
            dateEnd: new Date("2024-09-30T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "october",
            dateStart: new Date("2024-10-01T00:00:00Z"),
            dateEnd: new Date("2024-10-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "november",
            dateStart: new Date("2024-11-01T00:00:00Z"),
            dateEnd: new Date("2024-11-30T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "december",
            dateStart: new Date("2024-12-01T00:00:00Z"),
            dateEnd: new Date("2024-12-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "january",
            dateStart: new Date("2025-01-01T00:00:00Z"),
            dateEnd: new Date("2025-01-31T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "february",
            dateStart: new Date("2025-02-01T00:00:00Z"),
            dateEnd: new Date("2025-02-28T23:59:59Z"),
          }),
          expect.objectContaining({
            fiscalYear: "2024-25",
            month: "march",
            dateStart: new Date("2025-03-01T00:00:00Z"),
            dateEnd: new Date("2025-03-31T23:59:59Z"),
          }),
        ])
      })

      test("when creating a funding period, creates appropriate number of employee wage tiers", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2025-2026",
          fromDate: new Date("2025-04-01"),
          toDate: new Date("2026-03-31"),
          title: "Test Funding Period with Employee Wage Tiers",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeWageTiersCount = await EmployeeWageTier.count()
        expect(employeeWageTiersCount).toEqual(84)
      })

      test("when creating a funding period, creates employee wage tiers with correct tier levels and rates for fiscal period April 2026", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2026-2027",
          fromDate: new Date("2026-04-01"),
          toDate: new Date("2027-03-31"),
          title: "Test Funding Period Wage Tier Details",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeWageTiersForApril = await EmployeeWageTier.findAll({
          include: [
            {
              association: "fiscalPeriod",
              where: {
                fiscalYear: "2026-27",
                month: "april",
              },
            },
          ],
          order: [["tierLevel", "ASC"]],
        })

        expect(employeeWageTiersForApril).toEqual([
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 0,
            tierLabel: "Level 0",
            wageRatePerHour: expect.closeTo(0),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 1,
            tierLabel: "Level 1",
            wageRatePerHour: expect.closeTo(4.12),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 2,
            tierLabel: "Level 1a",
            wageRatePerHour: expect.closeTo(6.01),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 3,
            tierLabel: "Level 2",
            wageRatePerHour: expect.closeTo(7.44),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 4,
            tierLabel: "Level 2a",
            wageRatePerHour: expect.closeTo(9.96),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 5,
            tierLabel: "Level 3 Exemption",
            wageRatePerHour: expect.closeTo(12.31),
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 6,
            tierLabel: "ECE Level 3",
            wageRatePerHour: expect.closeTo(15.31),
          }),
        ])
      })

      test("when creating a funding period, creates employee benefits for all centres and fiscal periods", async () => {
        // Arrange
        await centreFactory.createList(3)

        const attributes = {
          fiscalYear: "2027-2028",
          fromDate: new Date("2027-04-01"),
          toDate: new Date("2028-03-31"),
          title: "Test Funding Period with Employee Benefits",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeBenefitsCount = await EmployeeBenefit.count()
        expect(employeeBenefitsCount).toEqual(36) // 3 centres × 12 fiscal periods = 36 employee benefits
      })

      test("when creating a funding period, creates employee benefits with default zero values", async () => {
        // Arrange
        const centre = await centreFactory.create()

        const attributes = {
          fiscalYear: "2028-2029",
          fromDate: new Date("2028-04-01"),
          toDate: new Date("2029-03-31"),
          title: "Test Funding Period Employee Benefits Defaults",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeBenefits = await EmployeeBenefit.findOne({
          where: { centreId: centre.id },
          include: [
            {
              association: "fiscalPeriod",
              where: {
                fiscalYear: "2028-29",
              },
            },
          ],
        })
        expect(employeeBenefits).toEqual(
          expect.objectContaining({
            centreId: centre.id,
            fiscalPeriodId: expect.any(Number),
            grossPayrollMonthlyActual: "0",
            grossPayrollMonthlyEstimated: "0",
            costCapPercentage: "0",
            employeeCostActual: "0",
            employeeCostEstimated: "0",
            employerCostActual: "0",
            employerCostEstimated: "0",
          })
        )
      })

      test("when creating a funding period with no centres, creates no employee benefits", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2029-2030",
          fromDate: new Date("2029-04-01"),
          toDate: new Date("2030-03-31"),
          title: "Test Funding Period No Centres",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeBenefitsCount = await EmployeeBenefit.count()
        expect(employeeBenefitsCount).toEqual(0)
      })

      test("when creating a funding period, creates funding reconciliations for all centres", async () => {
        // Arrange
        await centreFactory.createList(3)

        const attributes = {
          fiscalYear: "2030-2031",
          fromDate: new Date("2030-04-01"),
          toDate: new Date("2031-03-31"),
          title: "Test Funding Period with Reconciliations",
        }

        // Act
        const fundingPeriod = await CreateService.perform(attributes)

        // Assert
        const fundingReconciliationsCount = await FundingReconciliation.count({
          where: { fundingPeriodId: fundingPeriod.id },
        })
        expect(fundingReconciliationsCount).toEqual(3)
      })

      test("when creating a funding period, creates funding reconciliations with default zero values", async () => {
        // Arrange
        const centre = await centreFactory.create()

        const attributes = {
          fiscalYear: "2031-2032",
          fromDate: new Date("2031-04-01"),
          toDate: new Date("2032-03-31"),
          title: "Test Funding Period Reconciliation Defaults",
        }

        // Act
        const fundingPeriod = await CreateService.perform(attributes)

        // Assert
        const fundingReconciliation = await FundingReconciliation.findOne({
          where: {
            centreId: centre.id,
            fundingPeriodId: fundingPeriod.id,
          },
        })
        expect(fundingReconciliation).toMatchObject({
          centreId: centre.id,
          fundingPeriodId: fundingPeriod.id,
          status: "draft",
          fundingReceivedTotalAmount: "0",
          eligibleExpensesTotalAmount: "0",
          payrollAdjustmentsTotalAmount: "0",
          finalBalanceAmount: "0",
        })
      })

      test("when creating a funding period, creates funding reconciliation adjustments for all reconciliations and fiscal periods", async () => {
        // Arrange
        await centreFactory.createList(2)

        const attributes = {
          fiscalYear: "2032-2033",
          fromDate: new Date("2032-04-01"),
          toDate: new Date("2033-03-31"),
          title: "Test Funding Period with Adjustments",
        }

        // Act
        const fundingPeriod = await CreateService.perform(attributes)

        // Assert
        const fundingReconciliationAdjustmentsCount = await FundingReconciliationAdjustment.count({
          include: [
            {
              association: "fundingReconciliation",
              where: {
                fundingPeriodId: fundingPeriod.id,
              },
            },
          ],
        })
        expect(fundingReconciliationAdjustmentsCount).toEqual(24) // 2 centres × 12 fiscal periods = 24 adjustments
      })

      test("when creating a funding period, creates funding reconciliation adjustments with default zero values", async () => {
        // Arrange
        const centre = await centreFactory.create()

        const attributes = {
          fiscalYear: "2033-2034",
          fromDate: new Date("2033-04-01"),
          toDate: new Date("2034-03-31"),
          title: "Test Funding Period Adjustment Defaults",
        }

        // Act
        const fundingPeriod = await CreateService.perform(attributes)

        // Assert
        const fundingReconciliationAdjustment = await FundingReconciliationAdjustment.findOne({
          include: [
            {
              association: "fundingPeriod",
              where: {
                centreId: centre.id,
                id: fundingPeriod.id,
              },
            },
          ],
          rejectOnEmpty: true,
        })
        expect(fundingReconciliationAdjustment).toMatchObject({
          fundingReceivedPeriodAmount: "0",
          eligibleExpensesPeriodAmount: "0",
          payrollAdjustmentsPeriodAmount: "0",
          cumulativeBalanceAmount: "0",
        })
      })

      test("when creating a funding period with no centres, creates no funding reconciliations", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2034-2035",
          fromDate: new Date("2034-04-01"),
          toDate: new Date("2035-03-31"),
          title: "Test Funding Period No Centres Reconciliations",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const fundingReconciliationsCount = await FundingReconciliation.count()
        expect(fundingReconciliationsCount).toEqual(0)
      })

      test("when creating a funding period with no centres, creates no funding reconciliation adjustments", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2034-2035",
          fromDate: new Date("2034-04-01"),
          toDate: new Date("2035-03-31"),
          title: "Test Funding Period No Centres Adjustments",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const fundingReconciliationAdjustmentsCount = await FundingReconciliationAdjustment.count()
        expect(fundingReconciliationAdjustmentsCount).toEqual(0)
      })
    })
  })
})
