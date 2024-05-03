import { DateTime } from "luxon"

import http from "@/api/http-client"

import DateTimeUtils from "@/utils/date-time-utils"

export type FiscalPeriod = {
  id: number
  fiscalYear: string
  month: string
  dateStart: DateTime<true>
  dateEnd: DateTime<true>
  createdAt: DateTime<true>
  updatedAt: DateTime<true>
}

export type Params = {
  where?: {
    fiscalYear?: string
    month?: string
    dateStart?: Date
    dateEnd?: Date
  }
  page?: number
  perPage?: number
  otherParams?: any
}

// TODO: if fiscal year start date ends up being configurable
// this should be loaded from the fiscal_periods table instead of computed here.
export function getCurrentFiscalYearSlug() {
  const APRIL = 3 // April is the 4th month but JavaScript months are 0-indexed
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const isAfterFiscalYearStart = currentDate.getMonth() >= APRIL

  // If the current date is after the start of the fiscal year, the fiscal year is the current year and the next year.
  // Otherwise, the fiscal year is the previous year and the current year.
  const startYear = isAfterFiscalYearStart ? currentYear : currentYear - 1
  const endYear = startYear + 1
  const endYearShort = endYear.toString().slice(-2)
  return `${startYear}-${endYearShort}`
}

export const fiscalPeriodsApi = {
  list(params: Params = {}): Promise<{
    fiscalPeriods: FiscalPeriod[]
  }> {
    return http.get("/api/fiscal-periods", { params }).then(({ data }) => {
      const { fiscalPeriods } = data

      const fiscalPeriodsWithDates = fiscalPeriods.map((fiscalPeriod: any) => {
        const { dateStart, dateEnd, createdAt, updatedAt } = fiscalPeriod
        return {
          ...fiscalPeriod,
          dateStart: DateTimeUtils.fromISO(dateStart).toUTC(),
          dateEnd: DateTimeUtils.fromISO(dateEnd).toUTC(),
          createdAt: DateTimeUtils.fromISO(createdAt),
          updatedAt: DateTimeUtils.fromISO(updatedAt),
        }
      })

      return {
        fiscalPeriods: fiscalPeriodsWithDates,
      }
    })
  },
}

export default fiscalPeriodsApi
