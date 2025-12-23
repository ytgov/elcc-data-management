import { fundingPeriodFactory, fundingSubmissionLineFactory } from "@/factories"

import BulkCreateService from "@/services/funding-periods/funding-submission-lines/bulk-create-service"

describe("api/src/services/funding-periods/funding-submission-lines/bulk-create-service.ts", () => {
  describe("BulkCreateService", () => {
    describe("#perform", () => {
      test("when no funding submission lines exist, creates lines from defaults", async () => {
        // Arrange
        const fundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
        })

        // Act
        const fundingSubmissionLines = await BulkCreateService.perform(fundingPeriod)

        // Assert
        expect(fundingSubmissionLines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Child Care Spaces",
              lineName: "Infants",
              fromAge: 0,
              toAge: 18,
              monthlyAmount: "700",
            }),
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Child Care Spaces",
              lineName: "Toddlers",
              fromAge: 19,
              toAge: 36,
              monthlyAmount: "700",
            }),
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Child Care Spaces",
              lineName: "Preschool",
              fromAge: 4,
              toAge: 5,
              monthlyAmount: "700",
            }),
            // Etc.
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Children with Diverse Needs",
              lineName: "Preschool",
              fromAge: 4,
              toAge: 5,
              monthlyAmount: "91.6",
            }),
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Children with Diverse Needs",
              lineName: "Kindergarten",
              fromAge: 5,
              toAge: 6,
              monthlyAmount: "91.6",
            }),
            expect.objectContaining({
              fiscalYear: "2024/25",
              sectionName: "Children with Diverse Needs",
              lineName: "School Age",
              fromAge: 5,
              toAge: 6,
              monthlyAmount: "114.5",
            }),
          ])
        )
      })

      test("when funding submission lines exist in another fiscal year, copies from newest fiscal year", async () => {
        // Arrange
        const _olderFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2023-2024",
          createdAt: new Date("2023-01-01"),
        })

        await fundingSubmissionLineFactory.create({
          fiscalYear: "2023/24",
          sectionName: "Old Section",
          lineName: "Old Line",
          fromAge: 0,
          toAge: 1,
          monthlyAmount: "100.00",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2023/24",
          sectionName: "Old Section",
          lineName: "Another Old Line",
          fromAge: 2,
          toAge: 3,
          monthlyAmount: "200.00",
        })

        const _newerFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2024-2025",
          createdAt: new Date("2024-01-01"),
        })

        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "New Section",
          lineName: "New Line",
          fromAge: 0,
          toAge: 1,
          monthlyAmount: "150.00",
        })
        await fundingSubmissionLineFactory.create({
          fiscalYear: "2024/25",
          sectionName: "New Section",
          lineName: "Another New Line",
          fromAge: 2,
          toAge: 3,
          monthlyAmount: "250.00",
        })

        const targetFundingPeriod = await fundingPeriodFactory.create({
          fiscalYear: "2025-2026",
        })

        // Act
        const fundingSubmissionLines = await BulkCreateService.perform(targetFundingPeriod)

        // Assert
        expect(fundingSubmissionLines).toEqual([
          expect.objectContaining({
            fiscalYear: "2025/26",
            sectionName: "New Section",
            lineName: "New Line",
            fromAge: 0,
            toAge: 1,
            monthlyAmount: "150",
          }),
          expect.objectContaining({
            fiscalYear: "2025/26",
            sectionName: "New Section",
            lineName: "Another New Line",
            fromAge: 2,
            toAge: 3,
            monthlyAmount: "250",
          }),
        ])
      })
    })
  })
})
