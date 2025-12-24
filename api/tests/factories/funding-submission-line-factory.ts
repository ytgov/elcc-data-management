import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { FundingSubmissionLine } from "@/models"
import { formatAsFiscalYear } from "@/factories/helpers"

export const SECTION_NAMES_EXAMPLES = Object.freeze([
  "Child Care Spaces",
  "Administration (10% of Spaces)",
  "Quality Program Enhancement",
  "Children with Diverse Needs",
])

export const LINE_NAMES_EXAMPLES = Object.freeze([
  "Infants",
  "Toddlers",
  "Preschool",
  "Kindergarten (PT)",
  "Kindergarten (FT)",
  "School Age (PT)",
  "School Age (FT)",
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
    const monthlyAmount = faker.finance.amount({ min: 0, max: 1000, dec: 2 })

    return FundingSubmissionLine.build({
      fiscalYear,
      sectionName,
      lineName,
      monthlyAmount,
    })
  }
)
