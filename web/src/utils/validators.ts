export function dateRule(value: string) {
  const pattern = /^\d{4}-\d{2}-\d{2}$/
  return pattern.test(value) || "Date must be in yyyy-mm-dd format"
}
