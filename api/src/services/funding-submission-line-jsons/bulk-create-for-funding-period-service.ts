import { type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"

import { Centre, FundingSubmissionLine, FundingSubmissionLineJson } from "@/models"
import FundingPeriod from "@/models/funding-period"
import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const { fiscalYear: fundingPeriodFiscalYear, fromDate, toDate } = this.fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

    const fundingSubmissionLines = await FundingSubmissionLine.findAll({
      where: {
        fiscalYear: fiscalYearLegacy,
      },
    })
    if (fundingSubmissionLines.length === 0) {
      throw new Error(
        `No funding submission lines to template from found for the given fiscal year: ${fiscalYearLegacy}`
      )
    }

    const defaultLineValues = fundingSubmissionLines.map((fundingSubmissionLine) => ({
      submissionLineId: fundingSubmissionLine.id,
      sectionName: fundingSubmissionLine.sectionName,
      lineName: fundingSubmissionLine.lineName,
      monthlyAmount: fundingSubmissionLine.monthlyAmount,
      estimatedChildOccupancyRate: "0",
      actualChildOccupancyRate: "0",
      estimatedComputedTotal: "0",
      actualComputedTotal: "0",
    }))

    let bulkAttributes: CreationAttributes<FundingSubmissionLineJson>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      let currentDate = DateTime.fromJSDate(fromDate)
      const toDateDateTime = DateTime.fromJSDate(toDate)

      while (currentDate <= toDateDateTime) {
        const dateStart = currentDate.startOf("month")
        const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
        const dateName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(dateStart)

        bulkAttributes.push({
          centreId: centre.id,
          fiscalYear: fiscalYearLegacy,
          dateName,
          dateStart: dateStart.toJSDate(),
          dateEnd: dateEnd.toJSDate(),
          values: JSON.stringify(defaultLineValues),
        })

        if (bulkAttributes.length >= BATCH_SIZE) {
          await FundingSubmissionLineJson.bulkCreate(bulkAttributes)
          bulkAttributes = []
        }

        currentDate = currentDate.plus({ months: 1 })
      }
    })

    if (bulkAttributes.length > 0) {
      await FundingSubmissionLineJson.bulkCreate(bulkAttributes)
    }
  }
}

export default BulkCreateForFundingPeriodService
