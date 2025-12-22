import { CreationAttributes, Op } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { FundingPeriod, FundingSubmissionLine } from "@/models"
import FUNDING_SUBMISSION_LINE_DEFAULTS, {
  FundingSubmissionLineDefault,
} from "@/models/funding-submission-line-defaults"

import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine[]> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod

    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const previousFundingSubmissionLines =
      await this.findNewestFundingSubmissionLines(currentFiscalYearLegacy)

    if (!isEmpty(previousFundingSubmissionLines)) {
      return this.createFundingSubmissionLinesFromTemplateData(
        currentFiscalYearLegacy,
        previousFundingSubmissionLines
      )
    }

    return this.createFundingSubmissionLinesFromTemplateData(
      currentFiscalYearLegacy,
      FUNDING_SUBMISSION_LINE_DEFAULTS
    )
  }

  private async findNewestFundingSubmissionLines(
    excludeFiscalYearLegacy: string
  ): Promise<FundingSubmissionLine[]> {
    const newestFundingSubmissionLine = await FundingSubmissionLine.findOne({
      where: {
        fiscalYear: {
          [Op.ne]: excludeFiscalYearLegacy,
        },
      },
      order: [["fiscalYear", "DESC"]],
    })
    if (isNil(newestFundingSubmissionLine)) return []

    return FundingSubmissionLine.findAll({
      where: {
        fiscalYear: newestFundingSubmissionLine.fiscalYear,
      },
    })
  }

  private async createFundingSubmissionLinesFromTemplateData(
    currentFiscalYearLegacy: string,
    templateRows:
      | Pick<
          FundingSubmissionLine,
          "sectionName" | "lineName" | "fromAge" | "toAge" | "monthlyAmount"
        >[]
      | ReadonlyArray<FundingSubmissionLineDefault>
  ): Promise<FundingSubmissionLine[]> {
    const fundingSubmissionLines = []

    const fundingSubmissionLinesAttributes: CreationAttributes<FundingSubmissionLine>[] =
      templateRows.map((templateRow) => ({
        fiscalYear: currentFiscalYearLegacy,
        sectionName: templateRow.sectionName,
        lineName: templateRow.lineName,
        fromAge: templateRow.fromAge,
        toAge: templateRow.toAge,
        monthlyAmount: templateRow.monthlyAmount,
      }))

    for (const fundingSubmissionLineAttributes of fundingSubmissionLinesAttributes) {
      let fundingSubmissionLine = await FundingSubmissionLine.findOne({
        where: {
          fiscalYear: fundingSubmissionLineAttributes.fiscalYear,
          sectionName: fundingSubmissionLineAttributes.sectionName,
          lineName: fundingSubmissionLineAttributes.lineName,
        },
      })
      if (isNil(fundingSubmissionLine)) {
        fundingSubmissionLine = await FundingSubmissionLine.create(fundingSubmissionLineAttributes)
      }

      fundingSubmissionLines.push(fundingSubmissionLine)
    }

    return fundingSubmissionLines
  }
}

export default BulkCreateForFundingPeriodService
