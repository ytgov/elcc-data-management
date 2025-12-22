import { type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"

import {
  Centre,
  FundingSubmissionLine,
  FundingSubmissionLineJson,
  type FundingPeriod,
} from "@/models"
import BaseService from "@/services/base-service"
import { FundingPeriods, FundingSubmissionLines } from "@/services"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const fundingPeriod = await this.ensureCurrentFundingPeriod()
    const fundingSubmissionLines = await this.ensureFundingSubmissionLines(fundingPeriod)

    const BATCH_SIZE = 1000
    let bulkAttributes: CreationAttributes<FundingSubmissionLineJson>[] = []

    const { fiscalYear: fundingPeriodFiscalYear, fromDate, toDate } = fundingPeriod
    const fiscalYearLegacy = FundingSubmissionLine.toLegacyFiscalYearFormat(fundingPeriodFiscalYear)

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

    let currentDate = DateTime.fromJSDate(fromDate)
    const toDateDateTime = DateTime.fromJSDate(toDate)

    while (currentDate <= toDateDateTime) {
      const dateStart = currentDate.startOf("month")
      const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
      const dateName = FundingSubmissionLineJson.asFundingSubmissionLineJsonMonth(dateStart)

      bulkAttributes.push({
        centreId: this.centre.id,
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

    if (bulkAttributes.length > 0) {
      await FundingSubmissionLineJson.bulkCreate(bulkAttributes)
    }
  }

  private async ensureCurrentFundingPeriod() {
    return FundingPeriods.EnsureCurrentService.perform()
  }

  private async ensureFundingSubmissionLines(
    fundingPeriod: FundingPeriod
  ): Promise<FundingSubmissionLine[]> {
    return FundingSubmissionLines.BulkEnsureForFundingPeriodService.perform(fundingPeriod)
  }
}

export default BulkCreateForCentreService
