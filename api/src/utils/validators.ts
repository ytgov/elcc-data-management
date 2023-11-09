export function isValidFiscalYear(value: string) {
  const regex = /^(\d{4})\/(\d{2})$/
  const matches = value.match(regex)

  if (matches) {
    const startYearString = matches[1]
    const endYearString = startYearString + matches[2]
    const startYear = parseInt(startYearString, 10)
    const endYear = parseInt(endYearString, 10)

    if (endYear !== startYear + 1) {
      throw new Error(
        "fiscalYear must be in the format YYYY/YY, where the final YY must be one more than the previous YY, e.g. 2023/24."
      )
    }
  } else {
    throw new Error("fiscalYear must be in the format YYYY/YY.")
  }
}
