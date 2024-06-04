import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { FundingLineValue } from "@/models"

function assertParamsHasSubmissionLineId(
  params: DeepPartial<FundingLineValue>
): asserts params is DeepPartial<FundingLineValue> & { submissionLineId: number } {
  if (typeof params.submissionLineId !== "number") {
    throw new Error("submissionLineId is must be a number")
  }
}

const SECTION_NAMES_EXAMPLES = [
  "Child Care Spaces",
  "Administration (10% of Spaces)",
  "Quality Program Enhancement",
  "Children with Diverse Needs",
  "Building Expenses",
  "Wage Enhancement",
]

const LINE_NAMES_EXAMPLES = [
  "Infants",
  "Toddlers",
  "Preschool",
  "Kindergarten (PT)",
  "Kindergarten (FT)",
  "School Age (PT)",
  "School Age (FT)",
  "Rent or Mortgage",
  "Phone",
  "Internet",
  "Cell Phone",
  "Security",
  "Electric",
  "Fuel",
  "Garbage",
  "Snow Removal",
  "Water/Sewer/Taxes",
  "Insurance",
  "Janitorial",
  "Cleaning Supplies",
  "Minor Repairs",
  "Level 0",
  "Level 1",
  "Level 1a",
  "Level 2",
  "Level 2a",
  "Level 3eq",
  "Level 3",
]

export const fundingLineValueFactory = Factory.define<FundingLineValue>(({ params }) => {
  assertParamsHasSubmissionLineId(params)

  return {
    submissionLineId: params.submissionLineId,
    sectionName: faker.helpers.arrayElement(SECTION_NAMES_EXAMPLES),
    lineName: faker.helpers.arrayElement(LINE_NAMES_EXAMPLES),
    monthlyAmount: Number(faker.finance.amount(0, 1000, 2)),
    estimatedChildOccupancyRate: 0,
    actualChildOccupancyRate: 0,
    estimatedComputedTotal: 0,
    actualComputedTotal: 0,
  }
})

export default fundingLineValueFactory
