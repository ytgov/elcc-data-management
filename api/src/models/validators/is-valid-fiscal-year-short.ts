/**
 * Validates fiscal year in short format (YYYY-YY).
 * Checks both format and sequence (end year must be exactly one year after start year).
 *
 * @param value - The fiscal year string to validate
 * @throws Error if the fiscal year format is invalid or sequence is incorrect
 *
 * @example
 * isValidFiscalYearShort("2023-24") // valid
 * isValidFiscalYearShort("2023-25") // throws error - invalid sequence
 * isValidFiscalYearShort("2023/24") // throws error - wrong separator
 */
export function isValidFiscalYearShort(value: string): void {
  const match = value.match(/^(\d{4})-(\d{2})$/)

  if (!match) {
    throw new Error(`Fiscal year ${value} must be in format YYYY-YY (e.g., 2023-24)`)
  }

  const startYear = parseInt(match[1], 10)
  const endYearShort = parseInt(match[2], 10)
  const expectedEndYearShort = (startYear + 1) % 100

  if (endYearShort !== expectedEndYearShort) {
    const formattedExpectedEndYear = expectedEndYearShort.toString().padStart(2, "0")
    throw new Error(
      `Fiscal year end year must be exactly one year after start year (expected ${startYear}-${formattedExpectedEndYear})`
    )
  }
}

export default isValidFiscalYearShort
