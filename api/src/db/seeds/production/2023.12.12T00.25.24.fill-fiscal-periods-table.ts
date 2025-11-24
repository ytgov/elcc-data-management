import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"
import moment from "moment"

import { FiscalPeriod } from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"

export async function up() {
  const APRIL = 3 // JS Date months are zero-indexed

  const fiscalPeriodsAttributes: CreationAttributes<FiscalPeriod>[] = []

  for (let year = 2022; year <= 2026; year++) {
    const date = moment(new Date(year, APRIL, 1))

    for (let i = 0; i < 12; i++) {
      const dateStart = moment(date).startOf("month")
      const dateEnd = moment(dateStart).endOf("month").milliseconds(0)
      const dateName = dateStart.format("MMMM").toLowerCase() as FiscalPeriodMonths

      const fiscalYear = `${year}-${(year + 1).toString().slice(-2)}`

      fiscalPeriodsAttributes.push({
        fiscalYear,
        month: dateName,
        dateStart: dateStart.toDate(),
        dateEnd: dateEnd.toDate(),
      })

      date.add(1, "month")
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
