import { isEmpty, upperFirst } from "lodash"

import sumByDecimal from "@/utils/sum-by-decimal"

import { FiscalPeriod, FundingSubmissionLineJson } from "@/models"
import BaseService from "@/services/base-service"

export class CalculateEligibleExpensesPeriodAmountService extends BaseService {
  constructor(
    private centreId: number,
    private fiscalPeriodId: number
  ) {
    super()
  }

  async perform(): Promise<string> {
    const fiscalPeriod = await FiscalPeriod.findByPk(this.fiscalPeriodId, {
      rejectOnEmpty: true,
    })
    const { fiscalYear: fiscalYearShort, month } = fiscalPeriod
    const fiscalYearLegacy = fiscalYearShort.replace("-", "/")
    const monthLegacy = upperFirst(month)

    // TODO: find out, or ensure that there can only be one funding submission line json per month
    // TODO: link FundingSubmissionLineJson model to a fiscal period so this query can be simplified
    const fundingSubmissionLineJsons = await FundingSubmissionLineJson.findAll({
      where: {
        centreId: this.centreId,
        fiscalYear: fiscalYearLegacy,
        dateName: monthLegacy,
      },
    })

    if (isEmpty(fundingSubmissionLineJsons)) {
      return "0.0000"
    }

    const eligibleExpensesPeriodAmount = sumByDecimal(
      fundingSubmissionLineJsons,
      (fundingSubmissionLineJson) => {
        const { lines } = fundingSubmissionLineJson
        const linesSumAsBig = sumByDecimal(lines, "actualComputedTotal")
        return linesSumAsBig
      }
    )

    return eligibleExpensesPeriodAmount.toFixed(4)
  }
}

export default CalculateEligibleExpensesPeriodAmountService
