import { FiscalPeriod } from "@/models"

describe("api/tests/models/fiscal-period.test.ts", () => {
  describe("FiscalPeriod", () => {
    describe("#fiscalYear -> validation", () => {
      test("when fiscal year has valid format and sequence, validation succeeds", async () => {
        const fiscalPeriod = FiscalPeriod.build({
          fiscalYear: "2023-24",
          month: FiscalPeriod.Months.APRIL,
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
        })

        await expect(fiscalPeriod.validate()).resolves.not.toThrow()
      })

      test.each([
        "23-24",
        "2023-2024",
        "2023/24",
        "abcd-ef",
        "202324",
        "2023-2",
      ])(
        "when fiscal year $invalidFiscalYear has invalid format, it fails with format message",
        async (invalidFiscalYear) => {
          const fiscalPeriod = FiscalPeriod.build({
            fiscalYear: invalidFiscalYear,
            month: FiscalPeriod.Months.APRIL,
            dateStart: new Date("2023-04-01T00:00:00Z"),
            dateEnd: new Date("2023-04-30T23:59:59Z"),
          })

          await expect(fiscalPeriod.validate()).rejects.toThrow(
            `Fiscal year ${invalidFiscalYear} must be in format YYYY-YY (e.g., 2023-24)`
          )
        }
      )

      test.each<{
        value: string
        expected: string
        dateStart: string
        dateEnd: string
      }>([
        {
          value: "2023-23",
          expected: "2023-24",
          dateStart: "2023-04-01T00:00:00Z",
          dateEnd: "2023-04-30T23:59:59Z",
        },
        {
          value: "2023-25",
          expected: "2023-24",
          dateStart: "2023-04-01T00:00:00Z",
          dateEnd: "2023-04-30T23:59:59Z",
        },
        {
          value: "1999-99",
          expected: "1999-00",
          dateStart: "1999-04-01T00:00:00Z",
          dateEnd: "1999-04-30T23:59:59Z",
        },
        {
          value: "2000-00",
          expected: "2000-01",
          dateStart: "2000-04-01T00:00:00Z",
          dateEnd: "2000-04-30T23:59:59Z",
        },
      ])(
        "when fiscal year $value has valid format but invalid sequence, it fails with sequence message",
        async ({ value, expected, dateStart, dateEnd }) => {
          const fiscalPeriod = FiscalPeriod.build({
            fiscalYear: value,
            month: FiscalPeriod.Months.APRIL,
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
          })

          await expect(fiscalPeriod.validate()).rejects.toThrow(
            `Fiscal year end year must be exactly one year after start year (expected ${expected})`
          )
        }
      )
    })
  })
})
