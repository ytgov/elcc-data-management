import type { Migration } from "@/db/umzug"

import { FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"

export const up: Migration = async () => {
  const SECTION_NAME_TO_REMOVE = "Wage Enhancement"

  const fundingSubmissionLines = await FundingSubmissionLine.findAll({
    where: {
      sectionName: SECTION_NAME_TO_REMOVE,
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
      sectionName: SECTION_NAME_TO_REMOVE,
    },
  })
}

export const down: Migration = async () => {
  // no-op - this migration is not reversible, it is however idempotent
}
