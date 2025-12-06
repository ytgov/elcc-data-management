import { type CreationAttributes } from "@sequelize/core"
import { DateTime } from "luxon"

import { FiscalPeriod, FundingPeriod } from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"
import BaseService from "@/services/base-service"

export class BulkCreateForService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const {
      id: fundingPeriodId,
      fromDate: fundingPeriodFromDate,
      toDate: fundingPeriodToDate,
      fiscalYear: fundingPeriodFiscalYear,
    } = this.fundingPeriod

    const fiscalYearShort = FiscalPeriod.toShortFiscalYearFormat(fundingPeriodFiscalYear)

    let currentDate = DateTime.fromJSDate(fundingPeriodFromDate)
    const toDateDateTime = DateTime.fromJSDate(fundingPeriodToDate)
    const fiscalPeriodsAttributes: CreationAttributes<FiscalPeriod>[] = []

    while (currentDate <= toDateDateTime) {
      const dateStart = currentDate.startOf("month")
      const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
      const dateName = dateStart.toFormat("MMMM").toLowerCase()

      fiscalPeriodsAttributes.push({
        fundingPeriodId,
        fiscalYear: fiscalYearShort,
        month: dateName as FiscalPeriodMonths,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
      })

      currentDate = currentDate.plus({ months: 1 })
    }

    await FiscalPeriod.bulkCreate(fiscalPeriodsAttributes)
  }
}

export default BulkCreateForService
