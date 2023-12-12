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
  get(fiscalPeriodId: number): Promise<{ fiscalPeriod: FiscalPeriod }> {
    return http.get(`/api/fiscal-periods/${fiscalPeriodId}`).then(({ data }) => data)
  },
  create(attributes: Partial<FiscalPeriod>): Promise<{ fiscalPeriod: FiscalPeriod }> {
    return http.post("/api/fiscal-periods", attributes).then(({ data }) => data)
  },
  update(fiscalPeriodId: number, attributes: any): Promise<{ fiscalPeriod: FiscalPeriod }> {
    return http.patch(`/api/fiscal-periods/${fiscalPeriodId}`, attributes).then(({ data }) => data)
  },
  delete(fiscalPeriodId: number): Promise<void> {
    return http.delete(`/api/fiscal-periods/${fiscalPeriodId}`).then(({ data }) => data)
  },
}

export default fiscalPeriodsApi
