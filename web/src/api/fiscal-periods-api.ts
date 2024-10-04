import http from "@/api/http-client"

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
  dateStart: string
  dateEnd: string
  createdAt: string
  updatedAt: string
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
    return data
  },
}

export default fiscalPeriodsApi
