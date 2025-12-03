import {
  determineFiscalYearFormat,
  castFromShortToLegacyFormat,
  castFromLongToLegacyFormat,
} from "@/utils/fiscal-year/fiscal-year-common"

/**
 * Normalizes fiscal year from any supported format to legacy format (YYYY/YY).
 *
 * Supported input formats:
 * - Short format: YYYY-YY (e.g., "2023-24")
 * - Long format: YYYY-YYYY (e.g., "2023-2024")
 * - Legacy format: YYYY/YY (e.g., "2023/24")
 *
 * @param fiscalYear - The fiscal year in any supported format
 * @returns The fiscal year in legacy format (YYYY/YY)
 *
 * @example
 * normalizeFiscalYearToLegacyForm("2023-24") // returns "2023/24"
 * normalizeFiscalYearToLegacyForm("2023-2024") // returns "2023/24"
 * normalizeFiscalYearToLegacyForm("2023/24") // returns "2023/24"
 */
export function normalizeFiscalYearToLegacyForm(fiscalYear: string): string {
  const format = determineFiscalYearFormat(fiscalYear)

  switch (format) {
    case "YYYY/YY":
      return fiscalYear
    case "YYYY-YY":
      return castFromShortToLegacyFormat(fiscalYear)
    case "YYYY-YYYY":
      return castFromLongToLegacyFormat(fiscalYear)
    default:
      throw new Error(`Unsupported fiscal year format: ${format}`)
  }
}

export default normalizeFiscalYearToLegacyForm
