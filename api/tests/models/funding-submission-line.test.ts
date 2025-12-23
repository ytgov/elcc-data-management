import { FundingSubmissionLine } from "@/models"
import { fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

describe("api/src/models/funding-submission-line.ts", () => {
  describe("FundingSubmissionLine", () => {
    describe(".toLegacyFiscalYearFormat", () => {
      test("when fiscal year is in long format (YYYY-YYYY), converts to legacy format (YYYY/YY)", () => {
        // Arrange
        const fiscalYearLong = "2023-2024"

        // Act
        const result = FundingSubmissionLine.toLegacyFiscalYearFormat(fiscalYearLong)

        // Assert
        expect(result).toEqual("2023/24")
      })

      test("when fiscal year spans centuries, converts correctly", () => {
        // Arrange
        const fiscalYearLong = "1999-2000"

        // Act
        const result = FundingSubmissionLine.toLegacyFiscalYearFormat(fiscalYearLong)

        // Assert
        expect(result).toEqual("1999/00")
      })

      test("when fiscal year is in 2000s, converts correctly", () => {
        // Arrange
        const fiscalYearLong = "2024-2025"

        // Act
        const result = FundingSubmissionLine.toLegacyFiscalYearFormat(fiscalYearLong)

        // Assert
        expect(result).toEqual("2024/25")
      })
    })

    describe(".withScopes", () => {
      describe(".byFundingPeriodId scope", () => {
        test("when funding period exists with matching fiscal year, includes funding submission lines", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })
          const fundingSubmissionLine1 = await fundingSubmissionLineFactory.create({
            fiscalYear: "2023/24",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "100.0000",
          })
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2024/25", // Different fiscal year
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "200.0000",
          })

          // Act
          const fundingSubmissionLines = await FundingSubmissionLine.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineIds = fundingSubmissionLines.map(({ id }) => id)
          expect(fundingSubmissionLineIds).toEqual([fundingSubmissionLine1.id])
        })

        test("when funding period does not exist, returns no results", async () => {
          // Arrange
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2023/24",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "100.0000",
          })

          // Act
          const fundingSubmissionLines = await FundingSubmissionLine.withScope({
            method: ["byFundingPeriodId", -1],
          }).findAll()

          // Assert
          const fundingSubmissionLineIds = fundingSubmissionLines.map(({ id }) => id)
          expect(fundingSubmissionLineIds).toEqual([])
        })

        test("when multiple funding submission lines match fiscal year, includes all matching entities", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })
          const fundingSubmissionLine1 = await fundingSubmissionLineFactory.create({
            fiscalYear: "2023/24",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "100.0000",
          })
          const fundingSubmissionLine2 = await fundingSubmissionLineFactory.create({
            fiscalYear: "2023/24",
            sectionName: "Child Care Spaces",
            lineName: "Toddler Spaces",
            monthlyAmount: "150.0000",
          })

          await fundingSubmissionLineFactory.create({
            fiscalYear: "2024/25", // Different fiscal year
            sectionName: "Child Care Spaces",
            lineName: "Preschool Spaces",
            monthlyAmount: "200.0000",
          })

          // Act
          const fundingSubmissionLines = await FundingSubmissionLine.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineIds = fundingSubmissionLines.map(({ id }) => id)
          expect(fundingSubmissionLineIds).toEqual([
            fundingSubmissionLine1.id,
            fundingSubmissionLine2.id,
          ])
        })

        test("when fiscal year spans centuries, SQL transformation works correctly", async () => {
          // Arrange
          const fundingPeriod = await fundingPeriodFactory.create({
            fiscalYear: "1999-2000",
          })

          const fundingSubmissionLine1 = await fundingSubmissionLineFactory.create({
            fiscalYear: "1999/00",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "100.0000",
          })

          // Act
          const fundingSubmissionLines = await FundingSubmissionLine.withScope({
            method: ["byFundingPeriodId", fundingPeriod.id],
          }).findAll()

          // Assert
          const fundingSubmissionLineIds = fundingSubmissionLines.map(({ id }) => id)
          expect(fundingSubmissionLineIds).toEqual([fundingSubmissionLine1.id])
        })

        test("when using withScope and destroy with empty where, deletes only scoped records", async () => {
          // Arrange
          const fundingPeriod1 = await fundingPeriodFactory.create({
            fiscalYear: "2023-2024",
          })
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2023/24",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "100.0000",
          })

          await fundingPeriodFactory.create({
            fiscalYear: "2024-2025",
          })
          const fundingSubmissionLine2 = await fundingSubmissionLineFactory.create({
            fiscalYear: "2024/25",
            sectionName: "Child Care Spaces",
            lineName: "Infant Spaces",
            monthlyAmount: "200.0000",
          })

          // Act
          await FundingSubmissionLine.withScope({
            method: ["byFundingPeriodId", fundingPeriod1.id],
          }).destroy({ where: {} })

          // Assert
          const fundingSubmissionLines = await FundingSubmissionLine.findAll()
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
