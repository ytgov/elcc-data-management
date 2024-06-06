// TODO: if fiscal year start date ends up being configurable
// this should be loaded from the fiscal_periods table instead of computed here.
export function getCurrentFiscalYearSlug(currentDate = new Date()) {
  const APRIL = 3 // April is the 4th month but JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear()
  const isAfterFiscalYearStart = currentDate.getMonth() >= APRIL

  // If the current date is after the start of the fiscal year, the fiscal year is the current year and the next year.
  // Otherwise, the fiscal year is the previous year and the current year.
  const startYear = isAfterFiscalYearStart ? currentYear : currentYear - 1
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}-${endYearShort}`
}

export default getCurrentFiscalYearSlug
