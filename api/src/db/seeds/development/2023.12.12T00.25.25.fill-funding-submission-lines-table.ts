import type { SeedMigration } from "@/db/umzug"

import fundingSubmissionLineData from "@/db/data/funding-submission-lines.json"

export const up: SeedMigration = async ({ context: { FundingSubmissionLine, FiscalPeriod } }) => {
  const fiscalPeriods = await FiscalPeriod.findAll()

  const promises = fiscalPeriods.map(async (fiscalPeriod) => {
    const fiscalYear = fiscalPeriod.fiscalYear.replace("-", "/")
    const fundingSubmissionLinePromises = fundingSubmissionLineData.map((row) => {
      return FundingSubmissionLine.findOrCreate({
        where: {
          fiscalYear,
          sectionName: row.sectionName,
          lineName: row.lineName,
        },
        defaults: {
          fiscalYear,
          sectionName: row.sectionName,
          lineName: row.lineName,
          fromAge: row.fromAge,
          toAge: row.toAge,
          monthlyAmount: row.monthlyAmount,
        },
      })
    })
    return Promise.all(fundingSubmissionLinePromises)
  })

  await Promise.all(promises)
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
