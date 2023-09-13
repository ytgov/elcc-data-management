import { formatDollar } from "@/utils/formatter"

describe("api/src/utils/formatter.ts", () => {
  describe("formatDollar", () => {
    test.each([
      { input: 100, expected: "$100.00" },
      { input: 0.0, expected: "$0.00" },
      { input: -100, expected: "-$100.00" },
      { input: 10.5, expected: "$10.50" },
      { input: 10.555, expected: "$10.56" }, // TODO: this should probably be $10.56
      { input: NaN, expected: "$0.00" },
      { input: 0.005, expected: "$0.01" },
      { input: 0.004, expected: "$0.00" },
      { input: 0, expected: "$0.00" },
      { input: -0, expected: "$0.00" },
      { input: undefined, expected: "$0.00" },
    ])("formatDollar($input)", ({ input, expected }) => {
      expect(formatDollar(input)).toBe(expected)
    })

    test("formatDollar(Infinity)", () => {
      expect(() => formatDollar(Infinity)).toThrow("Infinity and -Infinity are not supported.")
    })

    test("formatDollar(-Infinity)", () => {
      expect(() => formatDollar(-Infinity)).toThrow("Infinity and -Infinity are not supported.")
    })
  })
})
