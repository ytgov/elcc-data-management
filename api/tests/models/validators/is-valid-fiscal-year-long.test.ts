import { isValidFiscalYearLong } from "@/models/validators"

describe("api/src/models/validators/is-valid-fiscal-year-long.ts", () => {
  describe("isValidFiscalYearLong", () => {
    test("accepts valid fiscal year with correct sequence", () => {
      expect(() => {
        isValidFiscalYearLong("2023-2024")
      }).not.toThrow()
    })

    test("accepts year boundary correctly (1999-2000)", () => {
      expect(() => {
        isValidFiscalYearLong("1999-2000")
      }).not.toThrow()
    })

    test.each([
      { value: "2023-2023", expected: "2023-2024" },
      { value: "2023-2025", expected: "2023-2024" },
      { value: "1999-1999", expected: "1999-2000" },
      { value: "2000-2000", expected: "2000-2001" },
    ])("rejects invalid sequence $value (expected $expected)", ({ value, expected }) => {
      expect(() => {
        isValidFiscalYearLong(value)
      }).toThrow(
        `Fiscal year end year must be exactly one year after start year (expected ${expected})`
      )
    })

    test.each([
      "23-24",
      "2023-24", // Short format
      "2023/2024", // Wrong separator
      "abcd-efgh",
      "20232024",
      "2023-202",
    ])("rejects invalid format '$0'", (invalidValue) => {
      expect(() => {
        isValidFiscalYearLong(invalidValue)
      }).toThrow("must be in format YYYY-YYYY")
    })
  })
})
