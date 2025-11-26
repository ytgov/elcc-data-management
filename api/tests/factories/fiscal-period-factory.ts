import { Factory } from "fishery"
import { DateTime } from "luxon"

import { FiscalPeriod } from "@/models"

import fundingPeriodFactory from "@/factories/funding-period-factory"

export const fiscalPeriodFactory = Factory.define<FiscalPeriod>(
  ({ associations, params, onCreate }) => {
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

    let currentYear = new Date().getFullYear()
    if (params.fiscalYear) {
      currentYear = parseInt(params.fiscalYear.split("-")[0])
    } else if (associations.fundingPeriod) {
      currentYear = parseInt(associations.fundingPeriod.fiscalYear.split("-")[0])
    }

    const nextYear = currentYear + 1
    const nextYearSuffix = nextYear.toString().slice(-2)
    const fiscalYearShort = [currentYear, nextYearSuffix].join("-")
    const fiscalYearLong = [currentYear, nextYear].join("-")

    const fundingPeriod =
      associations.fundingPeriod ??
      fundingPeriodFactory.build({
        id: params.fundingPeriodId,
        fiscalYear: fiscalYearLong,
      })

    const dateStart =
      params.dateStart ??
      fundingPeriod.fromDate ??
      DateTime.fromObject({
        year: currentYear,
        month: 4,
        day: 1,
      }).toJSDate()

    const dateStartDateTime = DateTime.fromJSDate(dateStart)

    const dateEnd = params.dateEnd ?? dateStartDateTime.plus({ months: 1 }).toJSDate()
    const month = params.month ?? FiscalPeriod.asFiscalPeriodMonth(dateStartDateTime)

    return FiscalPeriod.build({
      fundingPeriodId: fundingPeriod.id,
      fiscalYear: fiscalYearShort,
      month: month,
      dateStart,
      dateEnd,
    })
  }
)

export default fiscalPeriodFactory
