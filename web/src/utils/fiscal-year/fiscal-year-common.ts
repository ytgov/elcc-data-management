export type FiscalYearFormat = "YYYY-YY" | "YYYY-YYYY" | "YYYY/YY"

/**
 * Determines the format of a fiscal year string.
 *
 * @param fiscalYear - The fiscal year string to analyze
 * @returns The detected format
 * @throws Error if the format is not recognized
 */
export function determineFiscalYearFormat(fiscalYear: string): FiscalYearFormat {
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

// Conversion helper functions

export function castFromShortToLongFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("-")[0])
  const endYear = startYear + 1
  return `${startYear}-${endYear}`
}

export function castFromLegacyToLongFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("/")[0])
  const endYear = startYear + 1
  return `${startYear}-${endYear}`
}

export function castFromLongToShortFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("-")[0])
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}-${endYearShort}`
}

export function castFromLegacyToShortFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("/")[0])
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}-${endYearShort}`
}

export function castFromShortToLegacyFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("-")[0])
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}/${endYearShort}`
}

export function castFromLongToLegacyFormat(fiscalYear: string): string {
  const startYear = parseInt(fiscalYear.split("-")[0])
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}/${endYearShort}`
}
