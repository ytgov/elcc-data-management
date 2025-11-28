import { DateTime } from "luxon"
import { isNil } from "lodash"

/**
 * Creates a validator function that checks if a string is a valid date in the specified format.
 *
 * Uses Luxon to parse and validate the date, ensuring not only format correctness
 * but also semantic validity (e.g., rejects invalid dates like "2002-02-30").
 *
 * @param format - Date format string in Luxon format (default: "yyyy-MM-dd")
 * @returns A validator function that returns true if valid, error message if invalid
 *
 * @example
 * // Use with default format (yyyy-MM-dd)
 * :rules="[isDate()]"
 *
 * // Use with custom format
 * :rules="[isDate('yyyy/MM/dd')]"
 */
export function isDate(format = "yyyy-MM-dd"): (value: string) => boolean | string {
  return (value: string) => {
    if (isNil(value) || value === "") {
      return true
    }

    const parsedDate = DateTime.fromFormat(value, format)
    return parsedDate.isValid || `Date must be in ${format} format`
  }
}

export default isDate
