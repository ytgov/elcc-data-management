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
          dateStart: DateTimeUtils.fromISO(dateStart),
          dateEnd: DateTimeUtils.fromISO(dateEnd),
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
