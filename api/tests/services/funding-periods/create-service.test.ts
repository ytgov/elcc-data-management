import { EmployeeWageTier, FiscalPeriod, FundingSubmissionLine } from "@/models"

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
          title: "Year 2024 to 2025",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const fiscalPeriods = await FiscalPeriod.findAll()
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
          title: "Year 2025 to 2026",
        }

        // Act
        await CreateService.perform(attributes)

        // Assert
        const employeeWageTiersCount = await EmployeeWageTier.count()
        expect(employeeWageTiersCount).toEqual(EmployeeWageTier.DEFAULTS.length * 12) // 12 fiscal periods (months)
      })

      test("when creating a funding period, creates appropriate funding submission lines", async () => {
        // Arrange
        const attributes = {
          fiscalYear: "2026-2027",
          fromDate: new Date("2026-04-01"),
          toDate: new Date("2027-03-31"),
          title: "Year 2026 to 2027",
        }

        // Act
        await CreateService.perform(attributes)

        // Arrange
        const fundingSubmissionLinesCount = await FundingSubmissionLine.count()
        expect(fundingSubmissionLinesCount).toEqual(FundingSubmissionLine.DEFAULTS.length)
      })
    })
  })
})
