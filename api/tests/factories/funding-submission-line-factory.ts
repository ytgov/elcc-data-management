import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { FundingSubmissionLine } from "@/models"
import { formatAsFiscalYear } from "@/factories/helpers"

export const SECTION_NAMES_EXAMPLES = Object.freeze([
  "Child Care Spaces",
  "Administration (10% of Spaces)",
  "Quality Program Enhancement",
  "Children with Diverse Needs",
  "Building Expenses",
  "Wage Enhancement",
])

export const LINE_NAMES_EXAMPLES = Object.freeze([
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
])

export const fundingSubmissionLineFactory = Factory.define<FundingSubmissionLine>(
  ({ sequence, onCreate }) => {
    onCreate((fundingSubmissionLine) => fundingSubmissionLine.save())

    const year = faker.number.int({ min: 2022, max: 2027 })
    const fiscalYear = formatAsFiscalYear(year)

    return FundingSubmissionLine.build({
      id: sequence,
      fiscalYear,
      sectionName: faker.helpers.arrayElement(SECTION_NAMES_EXAMPLES),
      lineName: faker.helpers.arrayElement(LINE_NAMES_EXAMPLES),
      monthlyAmount: Number(faker.finance.amount(0, 1000, 2)),
    })
  }
)
