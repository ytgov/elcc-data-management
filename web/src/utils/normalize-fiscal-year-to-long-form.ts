export type FiscalYearFormat = "YYYY-YY" | "YYYY-YYYY" | "YYYY/YY"

/**
 * Normalizes fiscal year from any supported format to standard long format (YYYY-YYYY).
 *
 * Supported input formats:
 * - Short format: YYYY-YY (e.g., "2023-24")
 * - Long format: YYYY-YYYY (e.g., "2023-2024")
 * - Legacy format: YYYY/YY (e.g., "2023/24")
 *
 * @param fiscalYear - The fiscal year in any supported format
 * @returns The fiscal year in standard long format (YYYY-YYYY)
 *
 * @example
 * normalizeFiscalYearToLongForm("2023-24") // returns "2023-2024"
 * normalizeFiscalYearToLongForm("2023-2024") // returns "2023-2024"
 * normalizeFiscalYearToLongForm("2023/24") // returns "2023-2024"
 */
export function normalizeFiscalYearToLongForm(fiscalYear: string): string {
  const format = determineFormat(fiscalYear)

  switch (format) {
    case "YYYY-YYYY":
      return fiscalYear
    case "YYYY-YY":
      return castFromShortToLongFormat(fiscalYear)
    case "YYYY/YY":
      return castFromLegacyToLongFormat(fiscalYear)
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

function castFromShortToLongFormat(fiscalYear: string): string {
  const [startYear, _endYearShort] = fiscalYear.split("-")
  const endYearLong = (parseInt(startYear, 10) + 1).toString()
  return `${startYear}-${endYearLong}`
}

function castFromLegacyToLongFormat(fiscalYear: string): string {
  const [startYear, _endYearShort] = fiscalYear.split("/")
  const endYearLong = (parseInt(startYear, 10) + 1).toString()
  return `${startYear}-${endYearLong}`
}

export default normalizeFiscalYearToLongForm
