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
  ({ onCreate }) => {
    onCreate(async (fundingSubmissionLine) => {
      try {
        await fundingSubmissionLine.save()
        return fundingSubmissionLine
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create FundingSubmissionLine with attributes: ${JSON.stringify(fundingSubmissionLine.dataValues, null, 2)}`
        )
      }
    })

    const year = faker.number.int({ min: 2022, max: 2027 })
    const fiscalYear = formatAsFiscalYear(year)
    const sectionName = faker.helpers.arrayElement(SECTION_NAMES_EXAMPLES)
    const lineName = faker.helpers.arrayElement(LINE_NAMES_EXAMPLES)
    const monthlyAmount = Number(faker.finance.amount(0, 1000, 2))

    return FundingSubmissionLine.build({
      fiscalYear,
      sectionName,
      lineName,
      monthlyAmount,
    })
  }
)
