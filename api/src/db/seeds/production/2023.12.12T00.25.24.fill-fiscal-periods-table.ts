import { type CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import { FiscalPeriod, FundingPeriod } from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"

export async function up() {
  await FundingPeriod.findEach(async (fundingPeriod) => {
    const fiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriod.fiscalYear)

    let currentDate = DateTime.fromJSDate(fundingPeriod.fromDate)
    const toDate = DateTime.fromJSDate(fundingPeriod.toDate)

    while (currentDate <= toDate) {
      const dateStart = currentDate.startOf("month")
      const dateEnd = currentDate.endOf("month").set({ millisecond: 0 })
      const dateName = dateStart.toFormat("MMMM").toLowerCase()

      const fiscalPeriodAttributes: CreationAttributes<FiscalPeriod> = {
        fundingPeriodId: fundingPeriod.id,
        fiscalYear,
        month: dateName as FiscalPeriodMonths,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
      }

      let fiscalPeriod = await FiscalPeriod.findOne({
        where: {
          fundingPeriodId: fiscalPeriodAttributes.fundingPeriodId,
          fiscalYear: fiscalPeriodAttributes.fiscalYear,
          month: fiscalPeriodAttributes.month,
        },
      })

      if (isNil(fiscalPeriod)) {
        fiscalPeriod = await FiscalPeriod.create(fiscalPeriodAttributes)
      } else {
        await fiscalPeriod.update(fiscalPeriodAttributes)
      }

      currentDate = currentDate.plus({ months: 1 })
    }
  })
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
