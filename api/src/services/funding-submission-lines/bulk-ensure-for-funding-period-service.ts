import { isEmpty } from "lodash"

import { FundingPeriod, FundingSubmissionLine } from "@/models"

import BaseService from "@/services/base-service"
import BulkCreateForFundingPeriodService from "@/services/funding-submission-lines/bulk-create-for-funding-period-service"

export class BulkEnsureForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine[]> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLineCount = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: currentFiscalYearLegacy,
      },
    })
    if (!isEmpty(fundingSubmissionLineCount)) return fundingSubmissionLineCount

    return BulkCreateForFundingPeriodService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureForFundingPeriodService
