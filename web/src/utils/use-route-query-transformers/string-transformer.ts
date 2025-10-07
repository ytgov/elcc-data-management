import { isNil } from "lodash"

export const stringTransformer = {
  get(value: string | null | undefined) {
    if (isNil(value)) return ""

    return value
  },
  set(value: string | null | undefined) {
    if (isNil(value)) return ""

    return value
  },
}

export default stringTransformer
