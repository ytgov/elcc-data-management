import { isNil } from "lodash"

export function greaterThanOrEqualTo(
  minimum: number,
  { referenceFieldLabel }: { referenceFieldLabel?: string } = {}
): (value: string | number) => boolean | string {
  return (value: string | number) => {
    if (isNil(value) || value === "") {
      return true
    }

    let numericValue: number
    if (typeof value === "string") {
      numericValue = parseFloat(value)
    } else {
      numericValue = value
    }

    const hasValidNumericValue = !Number.isNaN(numericValue)
    const isAtLeastMinimum = hasValidNumericValue && numericValue >= minimum

    if (isAtLeastMinimum) {
      return true
    }

    let minimumLabel: number | string
    if (isNil(referenceFieldLabel)) {
      minimumLabel = minimum
    } else {
      minimumLabel = referenceFieldLabel
    }

    return `This field must be greater than or equal to ${minimumLabel}`
  }
}

export default greaterThanOrEqualTo
