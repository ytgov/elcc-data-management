import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { DateTime } from "luxon"

import { FiscalPeriod } from "@/models"
import { FiscalPeriodMonths } from "@/models/fiscal-period"
import { formatAsFiscalYear } from "@/factories/helpers"

export const fiscalPeriodFactory = Factory.define<FiscalPeriod>(({ onCreate }) => {
  onCreate(async (fiscalPeriod) => {
    try {
      await fiscalPeriod.save()
      return fiscalPeriod
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create FiscalPeriod with attributes: ${JSON.stringify(fiscalPeriod.dataValues, null, 2)}`
      )
    }
  })

  const year = faker.number.int({ min: 2022, max: 2027 })
  const month = faker.number.int({ min: 1, max: 12 })
  const dateStart = DateTime.local(year, month, 1).startOf("month")
  const dateEnd = dateStart.endOf("month")
  const monthName = dateStart.toFormat("MMMM").toLowerCase() as FiscalPeriodMonths

  const APRIL = 4 // Luxon uses 1-indexed months
  const fiscalYearStartYear = month >= APRIL ? year : year - 1
  const fiscalYear = formatAsFiscalYear(fiscalYearStartYear, { separator: "-" })

  return FiscalPeriod.build({
    fiscalYear,
    month: monthName,
    dateStart: dateStart.toJSDate(),
    dateEnd: dateEnd.toJSDate(),
  })
})

export default fiscalPeriodFactory
