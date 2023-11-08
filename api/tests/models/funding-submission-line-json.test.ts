import { FundingSubmissionLineJson } from "@/models"

describe("api/src/models/funding-submission-line-json.ts", () => {
  describe("FundingSubmissionLineJson", () => {
    describe("#lines", () => {
      it("is #values parsed as json", () => {
        const fundingSubmissionLineJson = FundingSubmissionLineJson.build({
          dateName: "April",
          dateStart: new Date("2020-01-01"),
          dateEnd: new Date("2020-01-01"),
          fiscalYear: "2020/21",
          values: "[1,2,3]",
        })
        expect(fundingSubmissionLineJson.lines).toEqual([1, 2, 3])
      })

      test("when #values is not valid json", () => {
        const fundingSubmissionLineJson = FundingSubmissionLineJson.build({
          dateName: "April",
          dateStart: new Date("2020-01-01"),
          dateEnd: new Date("2020-01-01"),
          fiscalYear: "2020/21",
          values: "[NotValidJson]",
        })
        expect(() => fundingSubmissionLineJson.lines).toThrow(
          "Unexpected token N in JSON at position 1"
        )
      })
    })
  })
})
