/**
 * Validates fiscal year in long format (YYYY-YYYY).
 * Checks both format and sequence (end year must be exactly one year after start year).
 *
 * @param value - The fiscal year string to validate
 * @throws Error if the fiscal year format is invalid or sequence is incorrect
 *
 * @example
 * isValidFiscalYearLong("2023-2024") // valid
 * isValidFiscalYearLong("2023-2025") // throws error - invalid sequence
 * isValidFiscalYearLong("2023-24") // throws error - wrong format
 */
export function isValidFiscalYearLong(value: string): void {
  const match = value.match(/^(\d{4})-(\d{4})$/)

  if (!match) {
    throw new Error(`Fiscal year ${value} must be in format YYYY-YYYY (e.g., 2023-2024)`)
  }

  const startYear = parseInt(match[1], 10)
  const endYear = parseInt(match[2], 10)

  if (endYear !== startYear + 1) {
    throw new Error(
      `Fiscal year end year must be exactly one year after start year (expected ${startYear}-${startYear + 1})`
    )
  }
}

export default isValidFiscalYearLong
