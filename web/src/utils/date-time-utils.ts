import { DateTime } from "luxon"

export function fromISO(dateString: string): DateTime<true> {
  const date = DateTime.fromISO(dateString)
  if (!date.isValid) {
    throw new Error(`Invalid date: ${dateString}: ${date.invalidReason}`)
  }

  return date
}

export default {
  fromISO,
}
