import { type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"
import { isEmpty } from "lodash"

import {
  Centre,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
  type FundingPeriod,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<FundingSubmissionLineJson[]> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const currentFiscalYearLegacy =
      FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: currentFiscalYearLegacy,
      },
    })
    if (isEmpty(fundingSubmissionLines)) {
      throw new Error("No funding submission lines found for the funding period.")
    }

    const { fromDate, toDate } = this.fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)
    const fundingSubmissionLineJsonsDefaults = fundingSubmissionLines.map(
      (fundingSubmissionLine) => ({
        submissionLineId: fundingSubmissionLine.id,
        sectionName: fundingSubmissionLine.sectionName,
        lineName: fundingSubmissionLine.lineName,
        monthlyAmount: fundingSubmissionLine.monthlyAmount,
        estimatedChildOccupancyRate: "0",
        actualChildOccupancyRate: "0",
        estimatedComputedTotal: "0",
        actualComputedTotal: "0",
      })
    )

    const fundingSubmissionLineJsonsAttributes: CreationAttributes<FundingSubmissionLineJson>[] = []
    let currentDate = DateTime.fromJSDate(fromDate)
    const toDateDateTime = DateTime.fromJSDate(toDate)

    while (currentDate <= toDateDateTime) {
      const dateStart = currentDate.startOf("month")
      const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
      const dateName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(dateStart)

      fundingSubmissionLineJsonsAttributes.push({
        centreId: this.centre.id,
        fiscalYear: fiscalYearLegacy,
        dateName,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
        values: JSON.stringify(fundingSubmissionLineJsonsDefaults),
      })

      currentDate = currentDate.plus({ months: 1 })
    }

    return FundingSubmissionLineJson.bulkCreate(fundingSubmissionLineJsonsAttributes)
  }
}

export default BulkCreateService
