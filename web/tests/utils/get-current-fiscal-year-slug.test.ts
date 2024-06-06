import getCurrentFiscalYearSlug from "@/utils/get-current-fiscal-year-slug"

describe("web/src/utils/get-current-fiscal-year-slug.ts", () => {
  describe("getCurrentFiscalYearSlug", () => {
    test.each([
      {
        inputDate: "2023-04-01",
        expectedFiscalYearSlug: "2023-24",
      },
      {
        inputDate: "2023-03-31",
        expectedFiscalYearSlug: "2022-23",
      },
      {
        inputDate: "2024-03-31",
        expectedFiscalYearSlug: "2023-24",
      },
      {
        inputDate: "2024-04-01",
        expectedFiscalYearSlug: "2024-25",
      },
    ])(
      "when the current date is $inputDate, returns $expectedFiscalYearSlug",
      ({ inputDate, expectedFiscalYearSlug }) => {
        // Arrange
        const date = new Date(inputDate)

        // Act
        const result = getCurrentFiscalYearSlug(date)

        // Assert
        expect(result).toBe(expectedFiscalYearSlug)
      }
    )
  })
})
