import { EmployeeWageTier, FiscalPeriod } from "@/models"

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
          isFiscalYear: true,
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
            isFiscalYear: true,
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
          isFiscalYear: true,
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
          isFiscalYear: true,
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
          isFiscalYear: true,
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
            wageRatePerHour: 0,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 1,
            tierLabel: "Level 1",
            wageRatePerHour: 4.12,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 2,
            tierLabel: "Level 1a",
            wageRatePerHour: 6.01,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 3,
            tierLabel: "Level 2",
            wageRatePerHour: 7.44,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 4,
            tierLabel: "Level 2a",
            wageRatePerHour: 9.96,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 5,
            tierLabel: "Level 3 Exemption",
            wageRatePerHour: 12.31,
          }),
          expect.objectContaining({
            fiscalPeriodId: expect.any(Number),
            tierLevel: 6,
            tierLabel: "ECE Level 3",
            wageRatePerHour: 15.31,
          }),
        ])
      })
    })
  })
})
