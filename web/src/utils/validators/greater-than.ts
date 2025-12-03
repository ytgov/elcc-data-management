import { isEmpty, isNil, isString } from "lodash"

export function greaterThan(
  minimum: number | string | null | undefined,
  { referenceFieldLabel }: { referenceFieldLabel?: string } = {}
): (value: unknown) => boolean | string {
  return (value: unknown) => {
    if (isNil(minimum) || (isString(minimum) && isEmpty(minimum))) return true
    if (isNil(value) || (isString(value) && isEmpty(value))) return true

    let numericMinimum: number
    if (typeof minimum === "string") {
      numericMinimum = parseFloat(minimum)
    } else if (typeof minimum === "number") {
      numericMinimum = minimum
    } else {
      return `This field must be a number`
    }

    let numericValue: number
    if (typeof value === "string") {
      numericValue = parseFloat(value)
    } else if (typeof value === "number") {
      numericValue = value
    } else {
      return `This field must be a number`
    }

    const hasValidNumericValue = !Number.isNaN(numericValue)
    const isGreaterThan = hasValidNumericValue && numericValue > numericMinimum

    if (isGreaterThan) {
      return true
    }

    const minimumLabel = referenceFieldLabel || minimum

    return `This field must be greater than ${minimumLabel}`
  }
}

export default greaterThan
