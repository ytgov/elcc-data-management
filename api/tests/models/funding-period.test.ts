import { FundingPeriod } from "@/models"

describe("api/src/models/funding-period.ts", () => {
  describe("FundingPeriod", () => {
    describe("#fiscalYear -> validation", () => {
      test("when fiscal year has valid format (YYYY-YYYY) and sequence, validation succeeds", async () => {
        const fundingPeriod = FundingPeriod.build({
          fiscalYear: "2023-2024",
          fromDate: new Date("2023-04-01T00:00:00Z"),
          toDate: new Date("2024-03-31T23:59:59Z"),
          title: "Fiscal Year 2023-2024",
        })

        await expect(fundingPeriod.validate()).resolves.not.toThrow()
      })

      test.each([
        "23-24",
        "2023/24",
        "abcd-ef",
        "202324",
        "2023-2",
        "2023-202",
        "2023-20245",
        "2023-24",
      ])(
        "when fiscal year '$0' has invalid format, it fails with format message",
        async (invalidFiscalYear) => {
          const fundingPeriod = FundingPeriod.build({
            fiscalYear: invalidFiscalYear,
            fromDate: new Date("2023-04-01T00:00:00Z"),
            toDate: new Date("2024-03-31T23:59:59Z"),
            title: "Test Fiscal Year",
          })

          await expect(fundingPeriod.validate()).rejects.toThrow(/must be in format YYYY-YYYY/)
        }
      )

      test.each<{
        value: string
        expected: string
      }>([
        {
          value: "2023-2023",
          expected: "2023-2024",
        },
        {
          value: "2023-2025",
          expected: "2023-2024",
        },
        {
          value: "1999-1999",
          expected: "1999-2000",
        },
        {
          value: "2000-2000",
          expected: "2000-2001",
        },
      ])(
        "when fiscal year $value has valid format but invalid sequence, it fails with sequence message",
        async ({ value, expected }) => {
          const fundingPeriod = FundingPeriod.build({
            fiscalYear: value,
            fromDate: new Date("2023-04-01T00:00:00Z"),
            toDate: new Date("2024-03-31T23:59:59Z"),
            title: "Test Fiscal Year",
          })

          await expect(fundingPeriod.validate()).rejects.toThrow(
            `Fiscal year end year must be exactly one year after start year (expected ${expected})`
          )
        }
      )
    })

    describe(".forEachMonth", () => {
      test("when funding period spans multiple months, iterates each month with correct date range and month name", () => {
        // Arrange
        const fundingPeriod = FundingPeriod.build({
          fiscalYear: "2024-2025",
          fromDate: new Date("2024-04-01T00:00:00Z"),
          toDate: new Date("2024-06-30T23:59:59Z"),
          title: "Fiscal Year 2024-2025",
        })

        const months: Array<{
          dateStart: Date
          dateEnd: Date
          monthName: string
        }> = []

        // Act
        fundingPeriod.forEachMonth((dateStart, dateEnd, monthName) => {
          months.push({
            dateStart,
            dateEnd,
            monthName,
          })
        })

        // Assert
        expect(months).toEqual([
          {
            dateStart: new Date("2024-04-01T00:00:00.000Z"),
            dateEnd: new Date("2024-04-30T23:59:59.000Z"),
            monthName: "april",
          },
          {
            dateStart: new Date("2024-05-01T00:00:00.000Z"),
            dateEnd: new Date("2024-05-31T23:59:59.000Z"),
            monthName: "may",
          },
          {
            dateStart: new Date("2024-06-01T00:00:00.000Z"),
            dateEnd: new Date("2024-06-30T23:59:59.000Z"),
            monthName: "june",
          },
        ])
      })
    })
  })
})
