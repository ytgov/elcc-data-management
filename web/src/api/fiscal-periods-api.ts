import http from "@/api/http-client"
import { type FiltersOptions, type QueryOptions, type WhereOptions } from "@/api/base-api"

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
  fundingPeriodId: number
  fiscalYear: string
  month: FiscalPeriodMonths
  dateStart: string
  dateEnd: string
  createdAt: string
  updatedAt: string
}

export type FiscalPeriodAsReference = Pick<
  FiscalPeriod,
  "id" | "fiscalYear" | "month" | "dateStart" | "dateEnd"
>

export type FiscalPeriodWhereOptions = WhereOptions<
  FiscalPeriod,
  "fiscalYear" | "month" | "dateStart" | "dateEnd"
>

export type FiscalPeriodFiltersOptions = FiltersOptions

export type FiscalPeriodQueryOptions = QueryOptions<
  FiscalPeriodWhereOptions,
  FiscalPeriodFiltersOptions
>

export const fiscalPeriodsApi = {
  async list(params: FiscalPeriodQueryOptions = {}): Promise<{
    fiscalPeriods: FiscalPeriod[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/fiscal-periods", { params })
    return data
  },
}

export default fiscalPeriodsApi
