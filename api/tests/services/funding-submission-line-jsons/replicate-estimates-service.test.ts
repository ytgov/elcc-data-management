import { ReplicateEstimatesService } from "@/services/funding-submission-line-jsons"
import {
  centreFactory,
  fundingLineValueFactory,
  fundingSubmissionLineFactory,
  fundingSubmissionLineJsonFactory,
} from "@/factories"

describe("api/src/services/funding-submission-line-jsons/replicate-estimates-service.ts", () => {
  describe("ReplicateEstimatesService", () => {
    describe("#perform", () => {
      test("when provided with a fundingSubmissionLineJson, it replicates the estimates to future submissions", async () => {
        // Arrange
        const centre1 = await centreFactory.create()
        const submissionLine1 = await fundingSubmissionLineFactory.create()
        const submissionLine2 = await fundingSubmissionLineFactory.create()
        const fundingLineValue1 = fundingLineValueFactory.build({
          submissionLineId: submissionLine1.id,
        })
        const fundingLineValue2 = fundingLineValueFactory.build({
          submissionLineId: submissionLine2.id,
        })
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-04-01T00:00:00Z"),
          dateEnd: new Date("2023-04-30T23:59:59Z"),
          dateName: "April",
          lines: [fundingLineValue1],
        })
        const fundingSubmissionLineJson2 = await fundingSubmissionLineJsonFactory.create({
          centreId: centre1.id,
          fiscalYear: "2023/24",
          dateStart: new Date("2023-05-01T00:00:00Z"),
          dateEnd: new Date("2023-05-31T23:59:59Z"),
          dateName: "May",
          lines: [fundingLineValue2],
        })

        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson1)

        // Assert
        await fundingSubmissionLineJson2.reload()
        expect(fundingSubmissionLineJson2.lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              sectionName: fundingLineValue1.sectionName,
              lineName: fundingLineValue1.lineName,
              monthlyAmount: fundingLineValue1.monthlyAmount,
            }),
          ])
        )
      })
    })
  })
})
