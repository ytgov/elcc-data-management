import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { FundingLineValue } from "@/models"
import {
  LINE_NAMES_EXAMPLES,
  SECTION_NAMES_EXAMPLES,
} from "@/factories/funding-submission-line-factory"

function assertParamsHasSubmissionLineId(
  params: DeepPartial<FundingLineValue>
): asserts params is DeepPartial<FundingLineValue> & { submissionLineId: number } {
  if (typeof params.submissionLineId !== "number") {
    throw new Error("submissionLineId is must be a number")
  }
}

export const fundingLineValueFactory = Factory.define<FundingLineValue>(({ params }) => {
  assertParamsHasSubmissionLineId(params)

  return {
    submissionLineId: params.submissionLineId,
    sectionName: faker.helpers.arrayElement(SECTION_NAMES_EXAMPLES),
    lineName: faker.helpers.arrayElement(LINE_NAMES_EXAMPLES),
    monthlyAmount: Number(faker.finance.amount({ min: 0, max: 1000, dec: 2 })),
    estimatedChildOccupancyRate: 0,
    actualChildOccupancyRate: 0,
    estimatedComputedTotal: 0,
    actualComputedTotal: 0,
  }
})

export default fundingLineValueFactory
