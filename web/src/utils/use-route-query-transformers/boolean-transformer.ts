import { isNil } from "lodash"

export const booleanTransformer = {
  get(value: boolean | string | null | undefined): boolean {
    if (isNil(value)) return false
    if (typeof value === "string") {
      return value === "true"
    }

    return value
  },
  set(value: boolean | string | null | undefined): string {
    if (isNil(value)) return "false"
    if (typeof value === "boolean") {
      return value.toString()
    }

    return value
  },
}

export default booleanTransformer
