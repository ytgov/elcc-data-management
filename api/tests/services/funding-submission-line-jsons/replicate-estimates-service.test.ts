import { pick } from "lodash"

import { FundingSubmissionLineJson } from "@/models"
import {
  centreFactory,
  fundingLineValueFactory,
  fundingSubmissionLineFactory,
  fundingSubmissionLineJsonFactory,
} from "@/factories"

import ReplicateEstimatesService from "@/services/funding-submission-line-jsons/replicate-estimates-service"

describe("api/src/services/funding-submission-line-jsons/replicate-estimates-service.ts", () => {
  describe("ReplicateEstimatesService", () => {
    describe("#perform", () => {
      test("when provided with a fundingSubmissionLineJson, it replicates the estimates to future submissions", async () => {
        // Arrange
        const centre1 = await centreFactory.create()
        const submissionLine1 = await fundingSubmissionLineFactory.create()
        const fundingLineValue1 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "1",
          actualChildOccupancyRate: "2",
          estimatedComputedTotal: "3",
          actualComputedTotal: "4",
        })
        const fundingLineValue2 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "0",
          actualChildOccupancyRate: "0",
          estimatedComputedTotal: "0",
          actualComputedTotal: "0",
        })
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.APRIL,
          lines: [fundingLineValue1],
        })
        const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-05-01T00:00:00Z"),
          dateEnd: new Date("2023-05-31T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.MAY,
          lines: [fundingLineValue2],
        })

        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson1)

        // Assert
        await fundingSubmissionLineJson2.reload()
        expect(fundingSubmissionLineJson2.lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              estimatedChildOccupancyRate: "1",
              actualChildOccupancyRate: "0",
              estimatedComputedTotal: "3",
              actualComputedTotal: "0",
            }),
          ])
        )
      })

      test("when provided with a fundingSubmissionLineJson, it does not replicate the estimates to past submissions", async () => {
        // Arrange
        const centre1 = await centreFactory.create()
        const submissionLine1 = await fundingSubmissionLineFactory.create()
        const fundingLineValue1 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "0",
          actualChildOccupancyRate: "0",
          estimatedComputedTotal: "0",
          actualComputedTotal: "0",
        })
        const fundingLineValue2 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "1",
          actualChildOccupancyRate: "2",
          estimatedComputedTotal: "3",
          actualComputedTotal: "4",
        })
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.APRIL,
          lines: [fundingLineValue1],
        })
        const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-05-01T00:00:00Z"),
          dateEnd: new Date("2023-05-31T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.MAY,
          lines: [fundingLineValue2],
        })

        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson2)

        // Assert
        await fundingSubmissionLineJson1.reload()
        expect(fundingSubmissionLineJson1.lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              estimatedChildOccupancyRate: "0",
              actualChildOccupancyRate: "0",
              estimatedComputedTotal: "0",
              actualComputedTotal: "0",
            }),
          ])
        )
      })

      test("when provided with a fundingSubmissionLineJson, it does not replicate the estimates to different centres", async () => {
        // Arrange
        const centre1 = await centreFactory.create()
        const centre2 = await centreFactory.create()
        const submissionLine1 = await fundingSubmissionLineFactory.create()
        const fundingLineValue1 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "1",
          actualChildOccupancyRate: "2",
          estimatedComputedTotal: "3",
          actualComputedTotal: "4",
        })
        const fundingLineValue2 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "0",
          actualChildOccupancyRate: "0",
          estimatedComputedTotal: "0",
          actualComputedTotal: "0",
        })
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.APRIL,
          lines: [fundingLineValue1],
        })
        const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre2.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-05-01T00:00:00Z"),
          dateEnd: new Date("2023-05-31T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.MAY,
          lines: [fundingLineValue2],
        })

        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson1)

        // Assert
        await fundingSubmissionLineJson2.reload()
        expect(fundingSubmissionLineJson2.lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              estimatedChildOccupancyRate: "0",
              actualChildOccupancyRate: "0",
              estimatedComputedTotal: "0",
              actualComputedTotal: "0",
            }),
          ])
        )
      })

      test("when provided with a fundingSubmissionLineJson, it does not replicate the estimates to different fiscal years", async () => {
        // Arrange
        const centre1 = await centreFactory.create()
        const submissionLine1 = await fundingSubmissionLineFactory.create()
        const fundingLineValue1 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "1",
          actualChildOccupancyRate: "2",
          estimatedComputedTotal: "3",
          actualComputedTotal: "4",
        })
        const fundingLineValue2 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
          ...pick(submissionLine1.dataValues, "sectionName", "lineName", "monthlyAmount"),
          estimatedChildOccupancyRate: "0",
          actualChildOccupancyRate: "0",
          estimatedComputedTotal: "0",
          actualComputedTotal: "0",
        })
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.APRIL,
          lines: [fundingLineValue1],
        })
        const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2024/25",
          dateStart: new Date("2024-05-01T00:00:00Z"),
          dateEnd: new Date("2024-05-31T23:59:59Z"),
          dateName: FundingSubmissionLineJson.Months.MAY,
          lines: [fundingLineValue2],
        })

        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson1)

        // Assert
        await fundingSubmissionLineJson2.reload()
        expect(fundingSubmissionLineJson2.lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              estimatedChildOccupancyRate: "0",
              actualChildOccupancyRate: "0",
              estimatedComputedTotal: "0",
              actualComputedTotal: "0",
            }),
          ])
        )
      })
    })
  })
})
