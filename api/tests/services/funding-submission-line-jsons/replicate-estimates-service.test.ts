import { fundingLineValueFactory, fundingSubmissionLineJsonFactory } from "@/factories"
import { ReplicateEstimatesService } from "@/services/funding-submission-line-jsons"

describe("api/src/services/funding-submission-line-jsons/replicate-estimates-service.ts", () => {
  describe("ReplicateEstimatesService", () => {
    describe("#perform", () => {
      test("when provided with a fundingSubmissionLineJson, it replicates the estimates to future submissions", async () => {
        // Arrange
        const fundingLineValue1 = fundingLineValueFactory.build()
        const fundingSubmissionLineJson1 = await fundingSubmissionLineJsonFactory.create({
          lines: [fundingLineValue1],
        })
        // Act
        await ReplicateEstimatesService.perform(fundingSubmissionLineJson1)

        // Assert
        console.log(`fundingSubmissionLineJson1:`, fundingSubmissionLineJson1)
      })
    })
  })
})
