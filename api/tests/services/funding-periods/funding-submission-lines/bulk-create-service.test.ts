import { FundingSubmissionLine } from "@/models"
import FUNDING_SUBMISSION_LINE_DEFAULTS from "@/models/funding-submission-line-defaults"
import { fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

import BulkCreateService from "@/services/funding-periods/funding-submission-lines/bulk-create-service"

describe("api/src/services/funding-periods/funding-submission-lines/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when previous fiscal year submission lines exist, creates new lines from previous year template", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2023/24",
          sectionName: "Template Section One",
          lineName: "Template Line One",
          monthlyAmount: "123.45",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2023/24",
          sectionName: "Template Section Two",
          lineName: "Template Line Two",
          monthlyAmount: "678.90",
        })

        // Act
        await BulkCreateService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLines = await FundingSubmissionLine.findAll({
          where: {
            fiscalYear: "2024/25",
          },
        })
        expect(fundingSubmissionLines).toEqual([
          expect.objectContaining({
            sectionName: "Template Section One",
            lineName: "Template Line One",
            monthlyAmount: "123.45",
          }),
          expect.objectContaining({
            sectionName: "Template Section Two",
            lineName: "Template Line Two",
            monthlyAmount: "678.9",
          }),
        ])
      })

      test("when no previous fiscal year submission lines exist, creates lines from base data", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })

        // Act
        await BulkCreateService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLines = await FundingSubmissionLine.findAll({
          where: {
            fiscalYear: "2024/25",
          },
        })
        expect(fundingSubmissionLines).toHaveLength(FUNDING_SUBMISSION_LINE_DEFAULTS.length)
      })

      test("when submission lines for the current fiscal year already exist, does not create duplicates", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2023/24",
          sectionName: "Template Section",
          lineName: "Template Line",
          monthlyAmount: "123.45",
        })
        const existingFundingSubmissionLineForFundingPeriod =
          await fundingSubmissionLineFactory.create({
            fiscalYear: "2024/25",
            sectionName: "Template Section",
            lineName: "Template Line",
            monthlyAmount: "123.45",
          })

        // Act
        await BulkCreateService.perform(fundingPeriod)

        // Assert
        const fundingSubmissionLines = await FundingSubmissionLine.findAll({
          where: {
            fiscalYear: "2024/25",
          },
        })
        expect(fundingSubmissionLines).toEqual([
          expect.objectContaining({
            id: existingFundingSubmissionLineForFundingPeriod.id,
          }),
        ])
      })
    })
  })
})
