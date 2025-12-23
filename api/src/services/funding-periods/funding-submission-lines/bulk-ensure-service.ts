import { isEmpty } from "lodash"

import { FundingPeriod, FundingSubmissionLine } from "@/models"

import BaseService from "@/services/base-service"
import BulkCreateService from "@/services/funding-periods/funding-submission-lines/bulk-create-service"

export class BulkEnsureService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<FundingSubmissionLine[]> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: currentFiscalYearLegacy,
      },
    })
    if (!isEmpty(fundingSubmissionLines)) return fundingSubmissionLines

    return BulkCreateService.perform(this.fundingPeriod)
  }
}

export default BulkEnsureService
