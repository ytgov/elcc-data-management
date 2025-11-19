import { isValidFiscalYearShort } from "./is-valid-fiscal-year-short"
import { isValidFiscalYearLong } from "./is-valid-fiscal-year-long"
import { isValidFiscalYearLegacy } from "./is-valid-fiscal-year-legacy"

export type FiscalYearFormat = "YYYY-YY" | "YYYY-YYYY" | "YYYY/YY"

/**
 * Validates fiscal year format and sequence based on the specified format.
 *
 * @param value - The fiscal year string to validate
 * @param format - The expected format ("YYYY-YY", "YYYY-YYYY", or "YYYY/YY")
 * @throws Error if the fiscal year format is invalid or sequence is incorrect
 *
 * @example
 * isValidFiscalYear("2023-24", "YYYY-YY") // valid
 * isValidFiscalYear("2023-2024", "YYYY-YYYY") // valid
 * isValidFiscalYear("2023/24", "YYYY/YY") // valid
 */
export function isValidFiscalYear(value: string, format: FiscalYearFormat): void {
  if (format === "YYYY-YY") {
    isValidFiscalYearShort(value)
  } else if (format === "YYYY-YYYY") {
    isValidFiscalYearLong(value)
  } else if (format === "YYYY/YY") {
    isValidFiscalYearLegacy(value)
  }
}

export default isValidFiscalYear
