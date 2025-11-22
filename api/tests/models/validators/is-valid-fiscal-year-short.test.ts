import { isValidFiscalYearShort } from "@/models/validators"

describe("api/src/models/validators/is-valid-fiscal-year-short.ts", () => {
  describe("isValidFiscalYearShort", () => {
    test("accepts valid fiscal year with correct sequence", () => {
      expect(() => {
        isValidFiscalYearShort("2023-24")
      }).not.toThrow()
    })

    test("accepts year boundary correctly (1999-00)", () => {
      expect(() => {
        isValidFiscalYearShort("1999-00")
      }).not.toThrow()
    })

    test("accepts year boundary correctly (2099-00)", () => {
      expect(() => {
        isValidFiscalYearShort("2099-00")
      }).not.toThrow()
    })

    test.each([
      { value: "2023-23", expected: "2023-24" },
      { value: "2023-25", expected: "2023-24" },
      { value: "1999-99", expected: "1999-00" },
      { value: "2000-00", expected: "2000-01" },
    ])("rejects invalid sequence $value (expected $expected)", ({ value, expected }) => {
      expect(() => {
        isValidFiscalYearShort(value)
      }).toThrow(
        `Fiscal year end year must be exactly one year after start year (expected ${expected})`
      )
    })

    test.each([
      "23-24", // Too short
      "2023-2024", // Long format
      "2023/24", // Forward slash
      "abcd-ef", // Not numbers
      "202324", // No separator
      "2023-2", // Incomplete
    ])("rejects invalid format '$0'", (invalidValue) => {
      expect(() => {
        isValidFiscalYearShort(invalidValue)
      }).toThrow("must be in format YYYY-YY")
    })
  })
})
