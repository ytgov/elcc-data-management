export function formatAsFiscalYear(startYear: number) {
  const endYear = (startYear + 1).toString().slice(-2)
  return `${startYear}/${endYear}`
}

export default {
  formatAsFiscalYear,
}
