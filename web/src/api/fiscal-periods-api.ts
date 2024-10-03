import { DateTime } from "luxon"

import http from "@/api/http-client"

import DateTimeUtils from "@/utils/date-time-utils"

/** Keep in sync with api/src/models/fiscal-period.ts */
export enum FiscalPeriodMonths {
  APRIL = "april",
  MAY = "may",
  JUNE = "june",
  JULY = "july",
  AUGUST = "august",
  SEPTEMBER = "september",
  OCTOBER = "october",
  NOVEMBER = "november",
  DECEMBER = "december",
  JANUARY = "january",
  FEBRUARY = "february",
  MARCH = "march",
}

export type FiscalPeriod = {
  id: number
  fiscalYear: string
  month: FiscalPeriodMonths
  dateStart: DateTime<true>
  dateEnd: DateTime<true>
  createdAt: DateTime<true>
  updatedAt: DateTime<true>
}

export type FiscalPeriodWhereOptions = {
  fiscalYear?: string
  month?: FiscalPeriodMonths
  dateStart?: string
  dateEnd?: string
}

export type FiscalPeriodFiltersOptions = {
  // add model scope signatures as needed
}

export const fiscalPeriodsApi = {
  async list(
    params: {
      where?: FiscalPeriodWhereOptions
      filters?: FiscalPeriodFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    fiscalPeriods: FiscalPeriod[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/fiscal-periods", { params })
    const { fiscalPeriods } = data

    // TODO: consider if this is really a good idea?
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
      ...data,
      fiscalPeriods: fiscalPeriodsWithDates,
    }
  },
}

export default fiscalPeriodsApi
