import {
  determineFiscalYearFormat,
  castFromLongToShortFormat,
  castFromLegacyToShortFormat,
} from "@/utils/fiscal-year/fiscal-year-common"

/**
 * Normalizes fiscal year from any supported format to standard short format (YYYY-YY).
 *
 * Supported input formats:
 * - Short format: YYYY-YY (e.g., "2023-24")
 * - Long format: YYYY-YYYY (e.g., "2023-2024")
 * - Legacy format: YYYY/YY (e.g., "2023/24")
 *
 * @param fiscalYear - The fiscal year in any supported format
 * @returns The fiscal year in standard short format (YYYY-YY)
 *
 * @example
 * normalizeFiscalYearToShortForm("2023-24") // returns "2023-24"
 * normalizeFiscalYearToShortForm("2023-2024") // returns "2023-24"
 * normalizeFiscalYearToShortForm("2023/24") // returns "2023-24"
 */
export function normalizeFiscalYearToShortForm(fiscalYear: string): string {
  const format = determineFiscalYearFormat(fiscalYear)

  switch (format) {
    case "YYYY-YY":
      return fiscalYear
    case "YYYY-YYYY":
      return castFromLongToShortFormat(fiscalYear)
    case "YYYY/YY":
      return castFromLegacyToShortFormat(fiscalYear)
    default:
      throw new Error(`Unsupported fiscal year format: ${format}`)
  }
}

export default normalizeFiscalYearToShortForm
