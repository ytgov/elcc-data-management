import { isArray, isEmpty, isString, isNull, isObject, isUndefined } from "lodash"

export function required(value: unknown): boolean | string {
  if (isNull(value) || isUndefined(value)) {
    return "This field is required"
  }

  if (value instanceof Date) {
    if (!isNaN(value.getTime())) return true

    return "This field is required"
  }

  if (value instanceof File) {
    if (value.size > 0) return true

    return "This field is required"
  }

  if ((isArray(value) || isString(value) || isObject(value)) && isEmpty(value)) {
    return "This field is required"
  }

  return true
}

export default required
