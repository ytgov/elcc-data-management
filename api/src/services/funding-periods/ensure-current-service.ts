import { type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"
import { isNil } from "lodash"

import { FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import CreateService from "@/services/funding-periods/create-service"

export class EnsureCurrentService extends BaseService {
  constructor() {
    super()
  }

  async perform(): Promise<FundingPeriod> {
    const currentFiscalYear = this.buildCurrentFiscalYear()

    const fundingPeriod = await FundingPeriod.findOne({
      where: {
        fiscalYear: currentFiscalYear,
      },
    })
    if (!isNil(fundingPeriod)) return fundingPeriod

    const [fromDate, toDate] = this.determineFromToDate(currentFiscalYear)
    const fundingPeriodAttributes: CreationAttributes<FundingPeriod> = {
      fiscalYear: currentFiscalYear,
      fromDate,
      toDate,
      title: currentFiscalYear,
    }
    return CreateService.perform(fundingPeriodAttributes)
  }

  private buildCurrentFiscalYear() {
    const currentDate = new Date()
    const APRIL = 3 // April is the 4th month but JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear()
    const isAfterFiscalYearStart = currentDate.getMonth() >= APRIL

    // If the current date is after the start of the fiscal year, the fiscal year is the current year and the next year.
    // Otherwise, the fiscal year is the previous year and the current year.
    const startYear = isAfterFiscalYearStart ? currentYear : currentYear - 1
    const endYear = startYear + 1
    return `${startYear}-${endYear}`
  }

  private determineFromToDate(fiscalYear: string) {
    const [startYear, endYear] = fiscalYear.split("-").map(Number)
    const fromDate = DateTime.fromObject({
      year: startYear,
      month: 4,
      day: 1,
    }).toJSDate()
    const toDate = DateTime.fromObject({
      year: endYear,
      month: 3,
      day: 31,
    }).toJSDate()
    return [fromDate, toDate]
  }
}

export default EnsureCurrentService
