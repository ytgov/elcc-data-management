import { isEmpty, isNil } from "lodash"
import { CreationAttributes } from "@sequelize/core"

import { FundingPeriod, FundingSubmissionLine } from "@/models"
import FUNDING_SUBMISSION_LINE_DEFAULTS, {
  FundingSubmissionLineDefault,
} from "@/models/funding-submission-line-defaults"

import BaseService from "@/services/base-service"

export class BulkCreateForService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod

    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)
    const previousFiscalYearLegacy = this.determinePreviousFiscalYearLegacy(currentFiscalYearLegacy)

    const previousFundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: previousFiscalYearLegacy,
      },
    })

    if (!isEmpty(previousFundingSubmissionLines)) {
      await this.createFundingSubmissionLinesFromTemplateData(
        currentFiscalYearLegacy,
        previousFundingSubmissionLines
      )

      return
    }

    await this.createFundingSubmissionLinesFromTemplateData(
      currentFiscalYearLegacy,
      FUNDING_SUBMISSION_LINE_DEFAULTS
    )
  }

  private determinePreviousFiscalYearLegacy(currentFiscalYearLegacy: string): string {
    const fiscalYearMatch = currentFiscalYearLegacy.match(/^(\d{4})\/\d{2}$/)
    if (isNil(fiscalYearMatch)) {
      throw new Error(`Invalid legacy fiscal year format: ${currentFiscalYearLegacy}`)
    }

    const startYear = Number(fiscalYearMatch[1])
    const previousStartYear = startYear - 1
    const previousEndYear = startYear
    const previousEndYearShort = previousEndYear.toString().slice(-2)
    return [previousStartYear, previousEndYearShort].join("/")
  }

  private async createFundingSubmissionLinesFromTemplateData(
    currentFiscalYearLegacy: string,
    templateRows:
      | Pick<
          FundingSubmissionLine,
          "sectionName" | "lineName" | "fromAge" | "toAge" | "monthlyAmount"
        >[]
      | ReadonlyArray<FundingSubmissionLineDefault>
  ): Promise<void> {
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
}

export default BulkCreateForService
