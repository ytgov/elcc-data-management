import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FundingPeriod, FundingSubmissionLine } from "@/models"

import FUNDING_SUBMISSION_LINE_DEFAULTS from "@/models/funding-submission-line-defaults"

export async function up() {
  await FundingPeriod.findEach(async (fundingPeriod: FundingPeriod) => {
    const { fiscalYear: fiscalYearLong } = fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fiscalYearLong)

    const fundingSubmissionLinesAttributes: CreationAttributes<FundingSubmissionLine>[] =
      FUNDING_SUBMISSION_LINE_DEFAULTS.map((row) => ({
        fiscalYear: fiscalYearLegacy,
        sectionName: row.sectionName,
        lineName: row.lineName,
        fromAge: row.fromAge,
        toAge: row.toAge,
        monthlyAmount: row.monthlyAmount,
      }))

    for (const fundingSubmissionLineAttributes of fundingSubmissionLinesAttributes) {
      const fundingSubmissionLine = await FundingSubmissionLine.findOne({
        where: {
          fiscalYear: fundingSubmissionLineAttributes.fiscalYear,
          sectionName: fundingSubmissionLineAttributes.sectionName,
          lineName: fundingSubmissionLineAttributes.lineName,
        },
      })

      if (isNil(fundingSubmissionLine)) {
        await FundingSubmissionLine.create(fundingSubmissionLineAttributes)
      }
    }
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
