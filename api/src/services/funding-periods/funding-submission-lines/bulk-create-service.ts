import { Op, sql } from "@sequelize/core"
import { isEmpty } from "lodash"

import { FundingPeriod, FundingSubmissionLine } from "@/models"

import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine[]> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod

    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLineDefaults = await this.buildFundingSubmissionLineDefaults()

    const fundingSubmissionLinesAttributes = fundingSubmissionLineDefaults.map(
      (fundingSubmissionLineDefault) => ({
        ...fundingSubmissionLineDefault,
        fiscalYear: currentFiscalYearLegacy,
      })
    )

    return FundingSubmissionLine.bulkCreate(fundingSubmissionLinesAttributes)
  }

  private async buildFundingSubmissionLineDefaults() {
    const newestFiscalYearWithFundingSubmissionLines = sql`
      (
        SELECT
          TOP 1 funding_submission_lines.fiscal_year
        FROM
          funding_submission_lines
        ORDER BY
          funding_submission_lines.fiscal_year DESC,
          funding_submission_lines.id DESC
      )
    `
    const newestFundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: {
          [Op.in]: newestFiscalYearWithFundingSubmissionLines,
        },
      },
    })
    if (isEmpty(newestFundingSubmissionLines)) return FundingSubmissionLine.DEFAULTS

    return newestFundingSubmissionLines.map(
      ({ sectionName, lineName, fromAge, toAge, monthlyAmount }) => ({
        sectionName,
        lineName,
        fromAge,
        toAge,
        monthlyAmount,
      })
    )
  }
}

export default BulkCreateService
