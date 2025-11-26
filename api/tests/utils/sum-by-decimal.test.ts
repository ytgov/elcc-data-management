import Big from "big.js"

import sumByDecimal from "@/utils/sum-by-decimal"

describe("api/src/utils/sum-by-decimal.ts", () => {
  describe("sumByDecimal", () => {
    describe("with string property accessor", () => {
      test("when array is empty, returns Big(0)", () => {
        const result = sumByDecimal([], "amount")
        expect(result.toString()).toBe("0")
      })

      test("when items have numeric values, sums correctly", () => {
        const items = [{ amount: 10 }, { amount: 20 }, { amount: 30 }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("60")
      })

      test("when items have string values, sums correctly", () => {
        const items = [{ amount: "10.5" }, { amount: "20.25" }, { amount: "30.75" }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("61.5")
      })

      test("when items have Big (decimal) values, sums correctly", () => {
        const items = [{ amount: Big(10) }, { amount: Big(20) }, { amount: Big(30) }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("60")
      })

      test("when items have mixed numeric and string values, sums correctly", () => {
        const items = [{ amount: 10 }, { amount: "20.5" }, { amount: 30.25 }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("60.75")
      })

      test("when items have null or undefined values, treats as 0", () => {
        const items = [{ amount: 10 }, { amount: null }, { amount: undefined }, { amount: 20 }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("30")
      })

      test("when property doesn't exist, treats as 0", () => {
        const items = [{ amount: 10 }, { otherValue: 20 }, { amount: 30 }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("40")
      })

      test("when values are decimal strings, maintains precision", () => {
        const items = [{ amount: "0.1" }, { amount: "0.2" }, { amount: "0.3" }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("0.6")
      })
    })

    describe("with function property accessor", () => {
      test("when function returns numbers, sums correctly", () => {
        const items = [
          { value: 10, multiplier: 2 },
          { value: 20, multiplier: 3 },
          { value: 30, multiplier: 1 },
        ]
        const result = sumByDecimal(items, (item) => item.value * item.multiplier)
        expect(result.toString()).toBe("110") // (10*2) + (20*3) + (30*1) = 20 + 60 + 30 = 110
      })

      test("when function returns strings, sums correctly", () => {
        const items = [
          { value: "10.5", tax: "2.5" },
          { value: "20.25", tax: "3.75" },
        ]
        const result = sumByDecimal(items, (item) => Big(item.value).plus(item.tax).toString())
        expect(result.toString()).toBe("37") // (10.5+2.5) + (20.25+3.75) = 13 + 24 = 37
      })

      test("when function returns null or undefined, treats as 0", () => {
        const items = [{ value: 10 }, { value: null }, { value: undefined }, { value: 20 }]
        const result = sumByDecimal(items, (item) => item.value)
        expect(result.toString()).toBe("30")
      })

      test("when function performs calculations, maintains precision", () => {
        const items = [
          { amount: "0.1", rate: "0.01" },
          { amount: "0.2", rate: "0.02" },
        ]
        const result = sumByDecimal(items, (item) => {
          const amount = Big(item.amount)
          const rate = Big(item.rate)
          return amount.times(rate).toString()
        })
        expect(result.toString()).toBe("0.005") // (0.1*0.01) + (0.2*0.02) = 0.001 + 0.004 = 0.005
      })
    })

    describe("edge cases", () => {
      test("when values are very large numbers, handles correctly", () => {
        const items = [{ amount: "1000000000000" }, { amount: "2000000000000" }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("3000000000000")
      })

      test("when values are very small decimals, maintains precision", () => {
        const items = [{ amount: "0.000001" }, { amount: "0.000002" }, { amount: "0.000003" }]
        const result = sumByDecimal(items, "amount")
        expect(result.toString()).toBe("0.000006")
      })

      test("when nested properties exist, accesses correctly", () => {
        const items = [
          { details: { amount: 10 } },
          { details: { amount: 20 } },
          { other: { amount: 30 } }, // This won't be included
        ]
        const result = sumByDecimal(items, "details.amount")
        expect(result.toString()).toBe("30")
      })
    })

    describe("return type", () => {
      test("returns Big instance", () => {
        const items = [{ amount: 10 }]
        const result = sumByDecimal(items, "amount")
        expect(result).toBeInstanceOf(Big)
      })

      test("can chain Big operations", () => {
        const items = [{ amount: 10 }, { amount: 20 }]
        const result = sumByDecimal(items, "amount")
        const doubled = result.times(2)
        expect(doubled.toString()).toBe("60") // (10+20)*2 = 60
      })
    })
  })
})
