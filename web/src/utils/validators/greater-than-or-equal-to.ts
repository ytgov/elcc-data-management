import { isNil } from "lodash"

export function greaterThanOrEqualTo(
  minimum: number,
  { referenceFieldLabel }: { referenceFieldLabel?: string } = {}
): (value: unknown) => boolean | string {
  return (value: unknown) => {
    if (isNil(value) || value === "") {
      return true
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
    const isAtLeastMinimum = hasValidNumericValue && numericValue >= minimum

    if (isAtLeastMinimum) {
      return true
    }

    const minimumLabel = referenceFieldLabel || minimum

    return `This field must be greater than or equal to ${minimumLabel}`
  }
}

export default greaterThanOrEqualTo
