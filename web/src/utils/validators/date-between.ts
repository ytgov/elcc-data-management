import { DateTime } from "luxon"
import { isNil } from "lodash"

export type DateBetweenOptions = {
  minLabel?: string
  maxLabel?: string
  format?: string
}

/**
 * Creates a validator function that checks if a date string is between min and max dates.
 *
 * Uses Luxon for date comparison. Null/undefined min or max values are ignored,
 * allowing for open-ended ranges.
 *
 * @param min - Minimum date string (inclusive), or null to skip min check
 * @param max - Maximum date string (inclusive), or null to skip max check
 * @param options - Optional configuration for labels and date format
 * @returns A validator function that returns true if valid, error message if invalid
 *
 * @example
 * // Basic usage
 * :rules="[dateBetween('2024-01-01', '2024-12-31')]"
 *
 * // With custom labels
 * :rules="[dateBetween(startDate, endDate, { minLabel: 'start of period', maxLabel: 'end of period' })]"
 *
 * // With only min date (no max)
 * :rules="[dateBetween('2024-01-01', null)]"
 */
export function dateBetween(
  min: string | null,
  max: string | null,
  options: DateBetweenOptions = {}
): (value: unknown) => boolean | string {
  const { minLabel, maxLabel, format = "yyyy-MM-dd" } = options

  return (value: unknown) => {
    if (isNil(value) || value === "") {
      return true
    }

    let dateValue: DateTime
    if (value instanceof Date) {
      dateValue = DateTime.fromJSDate(value)
    } else if (typeof value === "string") {
      dateValue = DateTime.fromFormat(value, format)
    } else {
      return true
    }

    if (!dateValue.isValid) {
      return `Date must be in ${format} format`
    }

    if (!isNil(min)) {
      const minDate = DateTime.fromFormat(min, format)
      if (minDate.isValid && dateValue < minDate) {
        const displayMin = minLabel || min
        return `Date must be on or after ${displayMin}`
      }
    }

    if (!isNil(max)) {
      const maxDate = DateTime.fromFormat(max, format)
      if (maxDate.isValid && dateValue > maxDate) {
        const displayMax = maxLabel || max
        return `Date must be on or before ${displayMax}`
      }
    }

    return true
  }
}

export default dateBetween
