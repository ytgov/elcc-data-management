import { isValidFiscalYear } from "@/models/validators"

describe("api/src/models/validators/is-valid-fiscal-year.ts", () => {
  describe("isValidFiscalYear", () => {
    describe("YYYY-YY format", () => {
      test("accepts valid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023-24", "YYYY-YY")
        }).not.toThrow()
      })

      test("rejects invalid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023-25", "YYYY-YY")
        }).toThrow()
      })
    })

    describe("YYYY-YYYY format", () => {
      test("accepts valid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023-2024", "YYYY-YYYY")
        }).not.toThrow()
      })

      test("rejects invalid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023-2025", "YYYY-YYYY")
        }).toThrow()
      })
    })

    describe("YYYY/YY format", () => {
      test("accepts valid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023/24", "YYYY/YY")
        }).not.toThrow()
      })

      test("rejects invalid fiscal year", () => {
        expect(() => {
          isValidFiscalYear("2023/25", "YYYY/YY")
        }).toThrow()
      })
    })
  })
})
