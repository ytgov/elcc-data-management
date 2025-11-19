import {
  isValidFiscalYear,
  isValidFiscalYearShort,
  isValidFiscalYearLong,
  isValidFiscalYearLegacy,
} from "@/models/validators"

describe("api/src/models/validators/is-valid-fiscal-year.ts", () => {
  describe("isValidFiscalYear", () => {
    describe("YYYY-YY format", () => {
      test("accepts valid fiscal year with correct sequence", () => {
        expect(() => {
          isValidFiscalYear("2023-24", "YYYY-YY")
        }).not.toThrow()
      })

      test("rejects invalid format", () => {
        expect(() => {
          isValidFiscalYear("2023/24", "YYYY-YY")
        }).toThrow("must be in format YYYY-YY")
      })

      test("rejects invalid sequence", () => {
        expect(() => {
          isValidFiscalYear("2023-25", "YYYY-YY")
        }).toThrow("expected 2023-24")
      })
    })

    describe("YYYY-YYYY format", () => {
      test("accepts valid fiscal year with correct sequence", () => {
        expect(() => {
          isValidFiscalYear("2023-2024", "YYYY-YYYY")
        }).not.toThrow()
      })

      test("rejects invalid format", () => {
        expect(() => {
          isValidFiscalYear("2023-24", "YYYY-YYYY")
        }).toThrow("must be in format YYYY-YYYY")
      })
    })

    describe("YYYY/YY format", () => {
      test("accepts valid fiscal year with correct sequence", () => {
        expect(() => {
          isValidFiscalYear("2023/24", "YYYY/YY")
        }).not.toThrow()
      })

      test("rejects invalid format", () => {
        expect(() => {
          isValidFiscalYear("2023-24", "YYYY/YY")
        }).toThrow("must be in format YYYY/YY")
      })
    })
  })

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
    ])("rejects invalid format '%s'", (invalidValue) => {
      expect(() => {
        isValidFiscalYearShort(invalidValue)
      }).toThrow("must be in format YYYY-YY")
    })
  })

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
    ])("rejects invalid format '%s'", (invalidValue) => {
      expect(() => {
        isValidFiscalYearLong(invalidValue)
      }).toThrow("must be in format YYYY-YYYY")
    })
  })

  describe("isValidFiscalYearLegacy", () => {
    test("accepts valid fiscal year with correct sequence", () => {
      expect(() => {
        isValidFiscalYearLegacy("2023/24")
      }).not.toThrow()
    })

    test("accepts year boundary correctly (1999/00)", () => {
      expect(() => {
        isValidFiscalYearLegacy("1999/00")
      }).not.toThrow()
    })

    test.each([
      { value: "2023/23", expected: "2023/24" },
      { value: "2023/25", expected: "2023/24" },
      { value: "1999/99", expected: "1999/00" },
    ])("rejects invalid sequence $value (expected $expected)", ({ value, expected }) => {
      expect(() => {
        isValidFiscalYearLegacy(value)
      }).toThrow(
        `Fiscal year end year must be exactly one year after start year (expected ${expected})`
      )
    })

    test.each([
      "23/24",
      "2023-24", // Hyphen instead of slash
      "2023/2024", // Long format
      "abcd/ef",
      "202324",
    ])("rejects invalid format '%s'", (invalidValue) => {
      expect(() => {
        isValidFiscalYearLegacy(invalidValue)
      }).toThrow("must be in format YYYY/YY")
    })
  })
})
