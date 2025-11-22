import { isNil } from "lodash"
import { DateTime, type DateTimeFormatOptions, type LocaleOptions } from "luxon"

export function formatDate(
  date: Date | string | null | undefined,
  formatOptions: DateTimeFormatOptions = DateTime.DATE_FULL,
  localeOptions?: LocaleOptions
): string {
  if (isNil(date)) {
    return ""
  }

  if (date instanceof Date) {
    return DateTime.fromJSDate(date).toLocaleString(formatOptions, localeOptions)
  }

  return DateTime.fromISO(date).toLocaleString(formatOptions, localeOptions)
}

export default formatDate
