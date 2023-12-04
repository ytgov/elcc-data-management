import type { SeedMigration } from "@/db/umzug"

import fundingSubmissionLineData from "@/db/data/funding-submission-lines.json"

export const up: SeedMigration = async ({ context: { FundingSubmissionLine } }) => {
  const promises = fundingSubmissionLineData.map((row) => {
    return FundingSubmissionLine.findOrCreate({
      where: {
        fiscalYear: row.fiscalYear,
        sectionName: row.sectionName,
        lineName: row.lineName,
      },
      defaults: {
        fiscalYear: row.fiscalYear,
        sectionName: row.sectionName,
        lineName: row.lineName,
        fromAge: row.fromAge,
        toAge: row.toAge,
        monthlyAmount: row.monthlyAmount,
      },
    })
  })

  return Promise.all(promises)
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
