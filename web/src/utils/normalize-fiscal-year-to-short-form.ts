import { type FiscalYearFormat } from "@/utils/normalize-fiscal-year-to-long-form"

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
  const format = determineFormat(fiscalYear)

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

function determineFormat(fiscalYear: string): FiscalYearFormat {
  if (/^\d{4}-\d{2}$/.test(fiscalYear)) {
    return "YYYY-YY"
  }

  if (/^\d{4}-\d{4}$/.test(fiscalYear)) {
    return "YYYY-YYYY"
  }

  if (/^\d{4}\/\d{2}$/.test(fiscalYear)) {
    return "YYYY/YY"
  }

  throw new Error(`Unrecognized fiscal year format: ${fiscalYear}`)
}

function castFromLongToShortFormat(fiscalYear: string): string {
  const [startYear, endYearLong] = fiscalYear.split("-")
  const endYearShort = endYearLong.slice(-2)
  return `${startYear}-${endYearShort}`
}

function castFromLegacyToShortFormat(fiscalYear: string): string {
  const [startYear, endYearShort] = fiscalYear.split("/")
  return `${startYear}-${endYearShort}`
}

export default normalizeFiscalYearToShortForm
