import convertIndexToAlphaIndex from "@/utils/convert-index-to-alpha-index"

describe("web/src/utils/convert-index-to-alpha-index.ts", () => {
  describe("convertIndexToAlphaIndex", () => {
    test.each([
      { index: 0, expectedLabel: "A" },
      { index: 25, expectedLabel: "Z" },
    ])("returns single letter for index $index", ({ index, expectedLabel }) => {
      // Arrange
      const columnIndex = index

      // Act
      const label = convertIndexToAlphaIndex(columnIndex)

      // Assert
      expect(label).toBe(expectedLabel)
    })

    test.each([
      { index: 26, expectedLabel: "AA" },
      { index: 27, expectedLabel: "AB" },
      { index: 51, expectedLabel: "AZ" },
    ])("rolls over to double letters after Z for index $index", ({ index, expectedLabel }) => {
      // Arrange
      const columnIndex = index

      // Act
      const label = convertIndexToAlphaIndex(columnIndex)

      // Assert
      expect(label).toBe(expectedLabel)
    })

    test.each([
      { index: 52, expectedLabel: "BA" },
      { index: 78, expectedLabel: "CA" },
    ])(
      "continues incrementing for subsequent double letters for index $index",
      ({ index, expectedLabel }) => {
        // Arrange
        const columnIndex = index

        // Act
        const label = convertIndexToAlphaIndex(columnIndex)

        // Assert
        expect(label).toBe(expectedLabel)
      }
    )
  })
})
