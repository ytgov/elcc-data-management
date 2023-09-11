import { FormatDollar } from "@/utils/formatter"

describe("api/src/utils/formatter.ts", () => {
  describe("FormatDollar", () => {
    test.each([
      { input: 100, expected: "$100.00" },
      { input: 0.0, expected: "$0.00" },
      { input: -100, expected: "-$100.00" },
      { input: 10.5, expected: "$10.50" },
      { input: 10.555, expected: "$10.55" }, // TODO: this should probably be $10.56
      { input: Infinity, expected: "$0.00" },
      { input: NaN, expected: "$0.00" },
      { input: 0.005, expected: "$0.01" },
      { input: 0.004, expected: "$0.00" },
      { input: 0, expected: "$0.00" },
      { input: -0, expected: "$0.00" },
    ])("FormatDollar($input)", ({ input, expected }) => {
      expect(FormatDollar(input)).toBe(expected)
    })
  })
})
