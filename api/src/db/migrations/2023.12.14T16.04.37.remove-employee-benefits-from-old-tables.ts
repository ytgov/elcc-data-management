import { type Migration } from "@/db/umzug"

import { FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"

export async function up({ context: _queryInterface }: Migration) {
  const EMPLOYEE_BENEFITS_SECTION_NAME = "Employee Benefits"

  const fundingSubmissionLines = await FundingSubmissionLine.findAll({
    where: {
      sectionName: EMPLOYEE_BENEFITS_SECTION_NAME,
    },
  })
  const fundingSubmissionLinesIds = fundingSubmissionLines.map(
    (fundingSubmissionLine) => fundingSubmissionLine.id
  )

  await FundingSubmissionLineJson.findEach(async (fundingSubmissionLineJson) => {
    const lines = fundingSubmissionLineJson.lines
    const cleanLines = lines.filter(
      (line) => !fundingSubmissionLinesIds.includes(line.submissionLineId)
    )

    await fundingSubmissionLineJson.update({ lines: cleanLines })
    return
  })

  await FundingSubmissionLine.destroy({
    where: {
      sectionName: EMPLOYEE_BENEFITS_SECTION_NAME,
    },
  })
}

export async function down({ context: _queryInterface }: Migration) {
  // no-op - this migration is not reversible, it is however idempotent
}
