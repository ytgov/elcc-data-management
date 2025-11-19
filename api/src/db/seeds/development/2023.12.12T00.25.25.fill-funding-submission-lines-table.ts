import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { FiscalPeriod, FundingSubmissionLine } from "@/models"

import fundingSubmissionLineData from "@/db/data/funding-submission-lines.json"

export async function up() {
  const fiscalPeriods = await FiscalPeriod.findAll()

  const fundingSubmissionLinesAttributes: CreationAttributes<FundingSubmissionLine>[] =
    fiscalPeriods.flatMap((fiscalPeriod) => {
      const fiscalYear = fiscalPeriod.fiscalYear.replace("-", "/")

      return fundingSubmissionLineData.map((row) => ({
        fiscalYear,
        sectionName: row.sectionName,
        lineName: row.lineName,
        fromAge: row.fromAge,
        toAge: row.toAge,
        monthlyAmount: row.monthlyAmount,
      }))
    })

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
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
