import { DateTime, type DateTimeOptions } from "luxon"

export function fromISO(dateString: string, options?: DateTimeOptions): DateTime<true> {
  const date = DateTime.fromISO(dateString, options)
  if (!date.isValid) {
    throw new Error(`Invalid date: ${dateString}: ${date.invalidReason}`)
  }

  return date
}

export default {
  fromISO,
}
