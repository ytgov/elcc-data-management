import { DateTime } from "luxon"

import { FundingSubmissionLineJson } from "@/models"
import { centreFactory, fundingPeriodFactory, fundingSubmissionLineJsonFactory } from "@/factories"

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

    describe(".withScopes", () => {
      describe(".byFundingPeriodId scope", () => {
        test("when funding period exists with matching fiscal year, includes funding submission line jsons", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })
          const centre = await centreFactory.create()
          const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2023/24",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2023-04-01T00:00:00Z"),
            dateEnd: new Date("2023-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2024/25", // Different fiscal year
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2024-04-01T00:00:00Z"),
            dateEnd: new Date("2024-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          // Act
          const fundingSubmissionLineJsons = await FundingSubmissionLineJson.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineJsonIds = fundingSubmissionLineJsons.map(({ id }) => id)
          expect(fundingSubmissionLineJsonIds).toEqual([fundingSubmissionLineJson1.id])
        })

        test("when funding period does not exist, returns no results", async () => {
          // Arrange
          const centre = await centreFactory.create()
          await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2023/24",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2023-04-01T00:00:00Z"),
            dateEnd: new Date("2023-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          // Act
          const fundingSubmissionLineJsons = await FundingSubmissionLineJson.withScope({
            method: ["byFundingPeriodId", -1],
          }).findAll()

          // Assert
          const fundingSubmissionLineJsonIds = fundingSubmissionLineJsons.map(({ id }) => id)
          expect(fundingSubmissionLineJsonIds).toEqual([])
        })

        test("when multiple funding submission line jsons match fiscal year, includes all matching entities", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })

          const centre = await centreFactory.create()
          const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2023/24",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2023-04-01T00:00:00Z"),
            dateEnd: new Date("2023-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2023/24",
            dateName: FundingSubmissionLineJson.Months.MAY,
            dateStart: new Date("2023-05-01T00:00:00Z"),
            dateEnd: new Date("2023-05-31T23:59:59Z"),
            values: JSON.stringify([]),
          })

          await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2024/25", // Different fiscal year
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2024-04-01T00:00:00Z"),
            dateEnd: new Date("2024-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          // Act
          const fundingSubmissionLineJsons = await FundingSubmissionLineJson.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineJsonIds = fundingSubmissionLineJsons.map(({ id }) => id)
          expect(fundingSubmissionLineJsonIds).toEqual([
            fundingSubmissionLineJson1.id,
            fundingSubmissionLineJson2.id,
          ])
        })

        test("when fiscal year spans centuries, SQL transformation works correctly", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "1999-2000",
          })

          const centre = await centreFactory.create()
          const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "1999/00",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("1999-04-01T00:00:00Z"),
            dateEnd: new Date("1999-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          // Act
          const fundingSubmissionLineJsons = await FundingSubmissionLineJson.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineJsonIds = fundingSubmissionLineJsons.map(({ id }) => id)
          expect(fundingSubmissionLineJsonIds).toEqual([fundingSubmissionLineJson1.id])
        })

        test("when using withScope and destroy with empty where, deletes only scoped records", async () => {
          // Arrange
          const fundingPeriod1 = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })
          const centre = await centreFactory.create()
          await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2023/24",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2023-04-01T00:00:00Z"),
            dateEnd: new Date("2023-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          await fundingPeriodFactory.create({
            fiscalYear: "2024-2025",
          })
          const fundingSubmissionLine2 = await fundingSubmissionLineJsonFactory.create({
            centreId: centre.id,
            fiscalYear: "2024/25",
            dateName: FundingSubmissionLineJson.Months.APRIL,
            dateStart: new Date("2024-04-01T00:00:00Z"),
            dateEnd: new Date("2024-04-30T23:59:59Z"),
            values: JSON.stringify([]),
          })

          // Act
          await FundingSubmissionLineJson.withScope({
            method: ["byFundingPeriodId", fundingPeriod1.id],
          }).destroy({ where: {} })

          // Assert
          const fundingSubmissionLines = await FundingSubmissionLineJson.findAll()
          expect(fundingSubmissionLines).toEqual([
            expect.objectContaining({
              id: fundingSubmissionLine2.id,
            }),
          ])
        })
      })
    })
  })
})
