import Big from "big.js"
import { get } from "lodash"

export function sumByDecimal<T>(
  items: T[],
  propertyAccessor: ((value: T) => number | string | Big | null | undefined) | string
): Big {
  return items.reduce((sumAsBig, item) => {
    let value: string = "0"

    if (typeof propertyAccessor === "string") {
      value = get(item, propertyAccessor)?.toString() ?? "0"
    } else {
      value = propertyAccessor(item)?.toString() ?? "0"
    }

    const valueAsBig = Big(value)
    const newTotal = sumAsBig.plus(valueAsBig)
    return newTotal
  }, new Big(0))
}

export default sumByDecimal
