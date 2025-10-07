import { isNil } from "lodash"

function integerGet<T extends string | number | null | undefined>(
  value: T
): number | (T & undefined) | (T & null) {
  if (isNil(value)) return value
  if (typeof value === "number") return value

  return parseInt(value, 10)
}

function integerSet<T extends number | string | null | undefined>(
  value: T
): string | (T & undefined) | (T & null) {
  if (isNil(value)) return value
  if (typeof value === "number") return value.toString()
  if (typeof value === "string") return value

  return ""
}

export const integerTransformer = {
  get: integerGet,
  set: integerSet,
} as const

export default integerTransformer
