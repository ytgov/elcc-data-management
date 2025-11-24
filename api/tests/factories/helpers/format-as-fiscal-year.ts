export function formatAsFiscalYear(startYear: number, { separator = "/" } = {}) {
  const endYear = (startYear + 1).toString().slice(-2)
  return [startYear, endYear].join(separator)
}

export default formatAsFiscalYear
