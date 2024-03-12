export function dateRule(value: string) {
  const pattern = /^\d{4}-\d{2}-\d{2}$/
  return pattern.test(value) || "Date must be in yyyy-mm-dd format"
}

export const required: (value: string) => boolean | string = (value) =>
  !!value || "Field is required"
