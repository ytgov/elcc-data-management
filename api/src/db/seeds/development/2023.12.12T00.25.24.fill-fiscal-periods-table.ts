import { DateTime } from "luxon"

import type { SeedMigration } from "@/db/umzug"

export const up: SeedMigration = async ({ context: { FiscalPeriod } }) => {
  const today = DateTime.now()
  const twoYearsAgo = today.minus({ years: 2 }).year
  const threeYearsFromNow = today.plus({ years: 3 }).year

  const APRIL = 4 // Luxon months are 1-indexed

  for (let year = twoYearsAgo; year <= threeYearsFromNow; year++) {
    let date = DateTime.local(year, APRIL, 1)

    for (let i = 0; i < 12; i++) {
      const dateStart = date.startOf("month")
      const dateEnd = date.endOf("month").set({ millisecond: 0 })
      const dateName = dateStart.toFormat("MMMM").toLowerCase()

      const fiscalYear = `${year}-${(year + 1).toString().slice(-2)}`

      await FiscalPeriod.findOrCreate({
        where: {
          fiscalYear,
          month: dateName,
        },
        defaults: {
          fiscalYear,
          month: dateName,
          dateStart: dateStart.toJSDate(),
          dateEnd: dateEnd.toJSDate(),
        },
      })

      date = date.plus({ months: 1 })
    }
  }
}

export const down: SeedMigration = async () => {
  // this method needs to exist, but does not need to be implemented.
  // Seeds should be idempotent.
}
