import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type FundingPeriod = {
  id: number
  fiscalYear: string
  fromDate: string
  toDate: string
  title: string
  isFiscalYear: boolean
  isSchoolMonth: boolean
  createdAt: string
  updatedAt: string
}

export type FundingPeriodAsShow = FundingPeriod

export type FundingPeriodAsIndex = FundingPeriod

export type FundingPeriodWhereOptions = WhereOptions<
  FundingPeriod,
  "id" | "fiscalYear" | "fromDate" | "toDate" | "title" | "isFiscalYear" | "isSchoolMonth"
>

export type FundingPeriodFiltersOptions = FiltersOptions

export type FundingPeriodQueryOptions = QueryOptions<
  FundingPeriodWhereOptions,
  FundingPeriodFiltersOptions
>

export const fundingPeriodsApi = {
  async list(params: FundingPeriodQueryOptions = {}): Promise<{
    fundingPeriods: FundingPeriodAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-periods", {
      params,
    })
    return data
  },
  async get(fundingPeriodId: number): Promise<{
    fundingPeriod: FundingPeriodAsShow
    policy: Policy
  }> {
    const { data } = await http.get(`/api/funding-periods/${fundingPeriodId}`)
    return data
  },
  async create(attributes: Partial<FundingPeriod>): Promise<{
    fundingPeriod: FundingPeriodAsShow
  }> {
    const { data } = await http.post("/api/funding-periods", attributes)
    return data
  },
  async update(
    fundingPeriodId: number,
    attributes: Partial<FundingPeriod>
  ): Promise<{
    fundingPeriod: FundingPeriodAsShow
  }> {
    const { data } = await http.patch(`/api/funding-periods/${fundingPeriodId}`, attributes)
    return data
  },
  async delete(fundingPeriodId: number): Promise<void> {
    const { data } = await http.delete(`/api/funding-periods/${fundingPeriodId}`)
    return data
  },
}

export default fundingPeriodsApi
