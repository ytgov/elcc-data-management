import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import { FiscalPeriod } from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"

export async function up() {
  const today = DateTime.now()
  const twoYearsAgo = today.minus({ years: 2 }).year
  const threeYearsFromNow = today.plus({ years: 3 }).year

  const APRIL = 4 // Luxon months are 1-indexed

  const fiscalPeriodsAttributes: CreationAttributes<FiscalPeriod>[] = []

  for (let year = twoYearsAgo; year <= threeYearsFromNow; year++) {
    let date = DateTime.local(year, APRIL, 1)

    for (let i = 0; i < 12; i++) {
      const dateStart = date.startOf("month")
      const dateEnd = date.endOf("month").set({ millisecond: 0 })
      const dateName = dateStart.toFormat("MMMM").toLowerCase() as FiscalPeriodMonths

      const fiscalYear = `${year}-${(year + 1).toString().slice(-2)}`

      fiscalPeriodsAttributes.push({
        fiscalYear,
        month: dateName,
        dateStart: dateStart.toJSDate(),
        dateEnd: dateEnd.toJSDate(),
      })

      date = date.plus({ months: 1 })
    }
  }

  for (const fiscalPeriodAttributes of fiscalPeriodsAttributes) {
    const fiscalPeriod = await FiscalPeriod.findOne({
      where: {
        fiscalYear: fiscalPeriodAttributes.fiscalYear,
        month: fiscalPeriodAttributes.month,
      },
    })

    if (isNil(fiscalPeriod)) {
      await FiscalPeriod.create(fiscalPeriodAttributes)
    }
  }
}

export async function down() {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
