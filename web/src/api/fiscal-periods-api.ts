import http from "@/api/http-client"

export type FiscalPeriod = {
  id: number
  fiscalYear: string
  month: string
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
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
    return http.get("/api/fiscal-periods", { params }).then(({ data }) => data)
  },
}

export default fiscalPeriodsApi
