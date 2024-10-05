import moment from "moment"

import type { SeedMigration } from "@/db/umzug"
import { FiscalPeriodMonths } from "@/models/fiscal-period"

export const up: SeedMigration = async ({ context: { FiscalPeriod } }) => {
  const APRIL = 3 // JS Date months are zero-indexed

  for (let year = 2022; year <= 2026; year++) {
    const date = moment(new Date(year, APRIL, 1))

    for (let i = 0; i < 12; i++) {
      const dateStart = moment(date).startOf("month")
      const dateEnd = moment(dateStart).endOf("month").milliseconds(0)
      const dateName = dateStart.format("MMMM").toLowerCase() as FiscalPeriodMonths

      const fiscalYear = `${year}-${(year + 1).toString().slice(-2)}`

      await FiscalPeriod.findOrCreate({
        where: {
          fiscalYear,
          month: dateName,
        },
        defaults: {
          fiscalYear,
          month: dateName,
          dateStart: dateStart.toDate(),
          dateEnd: dateEnd.toDate(),
        },
      })

      date.add(1, "month")
    }
  }
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
