import Big from "big.js"

import { type AtLeastTwo } from "@/utils/utility-types"

export function minDecimal(...values: AtLeastTwo<Big>): Big {
  return values.reduce((minValue, currentValue) => {
    return minValue.lt(currentValue) ? minValue : currentValue
  }, values[0])
}

export default minDecimal
