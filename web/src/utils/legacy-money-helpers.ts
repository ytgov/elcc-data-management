import { isNil } from "lodash"

export function centsToDollars(value: number | undefined) {
  if (isNil(value)) {
    return 0
  }

  return value / 100
}

export function dollarsToCents(value: number | undefined) {
  if (isNil(value)) {
    return 0
  }

  return value * 100
}
