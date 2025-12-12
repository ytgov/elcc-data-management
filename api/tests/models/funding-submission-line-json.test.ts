import { DateTime } from "luxon"

import { FundingSubmissionLineJson } from "@/models"

describe("api/src/models/funding-submission-line-json.ts", () => {
  describe("FundingSubmissionLineJson", () => {
    describe("#lines", () => {
      test("when values is valid json, returns parsed lines", () => {
        // Arrange
        const fundingSubmissionLineJson = FundingSubmissionLineJson.build({
          centreId: -1,
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2020-01-01"),
          dateEnd: new Date("2020-01-01"),
          fiscalYear: "2020/21",
          values: "[1,2,3]",
        })

        // Act
        const lines = fundingSubmissionLineJson.lines

        // Assert
        expect(lines).toEqual([1, 2, 3])
      })

      test("when values is not valid json, throws an error", () => {
        // Arrange
        const fundingSubmissionLineJson = FundingSubmissionLineJson.build({
          centreId: -1,
          dateName: FundingSubmissionLineJson.Months.APRIL,
          dateStart: new Date("2020-01-01"),
          dateEnd: new Date("2020-01-01"),
          fiscalYear: "2020/21",
          values: "[NotValidJson]",
        })

        // Act & Assert
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          fundingSubmissionLineJson.lines
        }).toThrow("Unexpected token 'N', \"[NotValidJson]\" is not valid JSON")
      })
    })

    describe(".asFundingSubmissionLineJsonMonth", () => {
      test("when given a DateTime, returns the corresponding month enum value", () => {
        // Arrange
        const aprilDateTime = DateTime.fromISO("2024-04-15T00:00:00Z")

        // Act
        const monthName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(aprilDateTime)

        // Assert
        expect(monthName).toEqual(FundingSubmissionLineJson.Months.APRIL)
      })

      test("when given a Date, returns the corresponding month enum value", () => {
        // Arrange
        const aprilDate = new Date("2024-04-15T00:00:00Z")

        // Act
        const monthName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(aprilDate)

        // Assert
        expect(monthName).toEqual(FundingSubmissionLineJson.Months.APRIL)
      })

      test("when given a lowercase month string, uppercases first letter and returns enum value", () => {
        // Arrange
        const aprilAsLowercaseString = "april"

        // Act
        const monthName =
          FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(aprilAsLowercaseString)

        // Assert
        expect(monthName).toEqual(FundingSubmissionLineJson.Months.APRIL)
      })

      test("when given an invalid month string, throws an error", () => {
        // Arrange
        const invalidMonthName = "NotAMonth"

        // Act & Assert
        expect(() => {
          FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(invalidMonthName)
        }).toThrow("Invalid funding submission line json month: NotAMonth")
      })
    })
  })
})
