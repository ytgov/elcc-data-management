import Big from "big.js"

import { type AtLeastTwo } from "@/utils/utility-types"

import minDecimal from "@/utils/min-decimal"

describe("api/src/utils/min-decimal.ts", () => {
  describe("minDecimal", () => {
    describe("basic minimum operations", () => {
      test.each<{
        values: AtLeastTwo<Big>
        expected: string
        description: string
      }>([
        { values: [Big(1), Big(2)], expected: "1", description: "two values, first is minimum" },
        { values: [Big(5), Big(3)], expected: "3", description: "two values, second is minimum" },
        {
          values: [Big(1), Big(2), Big(3)],
          expected: "1",
          description: "three values, first is minimum",
        },
        {
          values: [Big(3), Big(1), Big(2)],
          expected: "1",
          description: "three values, middle is minimum",
        },
        {
          values: [Big(3), Big(2), Big(1)],
          expected: "1",
          description: "three values, last is minimum",
        },
        {
          values: [Big(10), Big(5), Big(8), Big(3), Big(7)],
          expected: "3",
          description: "five values, minimum in middle",
        },
      ])("when $description, returns $expected", ({ values, expected }) => {
        const result = minDecimal(...values)
        expect(result.toString()).toBe(expected)
      })
    })

    describe("equal values", () => {
      test("when both values are equal, returns that value", () => {
        const result = minDecimal(Big(5), Big(5))
        expect(result.toString()).toBe("5")
      })

      test("when all values are equal, returns that value", () => {
        const result = minDecimal(Big(10), Big(10), Big(10), Big(10))
        expect(result.toString()).toBe("10")
      })
    })

    describe("decimal precision", () => {
      test("when values are decimal strings, maintains precision", () => {
        const result = minDecimal(Big("0.3"), Big("0.1"), Big("0.2"))
        expect(result.toString()).toBe("0.1")
      })

      test("when values are very small decimals, maintains precision", () => {
        const result = minDecimal(Big("0.000003"), Big("0.000001"), Big("0.000002"))
        expect(result.toString()).toBe("0.000001")
      })

      test("when decimal values are close, maintains precision", () => {
        const result = minDecimal(Big("10.5001"), Big("10.5"), Big("10.5002"))
        expect(result.toString()).toBe("10.5")
      })
    })

    describe("negative numbers", () => {
      test.each<{
        values: AtLeastTwo<Big>
        expected: string
        description: string
      }>([
        {
          values: [Big(-1), Big(1)],
          expected: "-1",
          description: "negative and positive, negative is minimum",
        },
        {
          values: [Big(-5), Big(-3), Big(-1)],
          expected: "-5",
          description: "all negative, most negative is minimum",
        },
        {
          values: [Big(5), Big(-10), Big(3)],
          expected: "-10",
          description: "mixed values, negative is minimum",
        },
        {
          values: [Big(-0.5), Big(0.5)],
          expected: "-0.5",
          description: "negative and positive decimals",
        },
      ])("when $description, returns $expected", ({ values, expected }) => {
        const result = minDecimal(...values)
        expect(result.toString()).toBe(expected)
      })
    })

    describe("zero values", () => {
      test("when zero is the minimum, returns zero", () => {
        const result = minDecimal(Big(0), Big(5), Big(10))
        expect(result.toString()).toBe("0")
      })

      test("when comparing zero and negative, returns negative", () => {
        const result = minDecimal(Big(0), Big(-1))
        expect(result.toString()).toBe("-1")
      })

      test("when both values are zero, returns zero", () => {
        const result = minDecimal(Big(0), Big(0))
        expect(result.toString()).toBe("0")
      })
    })

    describe("large numbers", () => {
      test("when values are very large numbers, handles correctly", () => {
        const result = minDecimal(Big("3000000000000"), Big("1000000000000"), Big("2000000000000"))
        expect(result.toString()).toBe("1000000000000")
      })

      test("when values are very large decimals, maintains precision", () => {
        const result = minDecimal(Big("1000000000000.001"), Big("1000000000000.002"))
        expect(result.toString()).toBe("1000000000000.001")
      })
    })

    describe("return type", () => {
      test("returns Big instance", () => {
        const result = minDecimal(Big(10), Big(20))
        expect(result).toBeInstanceOf(Big)
      })

      test("can chain Big operations", () => {
        const result = minDecimal(Big(10), Big(5), Big(8))
        const doubled = result.times(2)
        expect(doubled.toString()).toBe("10") // min(10,5,8) * 2 = 5 * 2 = 10
      })

      test("can use in further Big calculations", () => {
        const min1 = minDecimal(Big(10), Big(5))
        const min2 = minDecimal(Big(8), Big(3))
        const sum = min1.plus(min2)
        expect(sum.toString()).toBe("8") // min(10,5) + min(8,3) = 5 + 3 = 8
      })
    })
  })
})
