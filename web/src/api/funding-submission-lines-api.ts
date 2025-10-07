import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type FundingSubmissionLine = {
  id: number
  fiscalYear: string
  sectionName: string
  lineName: string
  fromAge: number | null
  toAge: number | null
  monthlyAmount: number
  createdAt: string
  updatedAt: string
}

export type FundingSubmissionLinePolicy = Policy

export type FundingSubmissionLineAsIndex = FundingSubmissionLine & {
  ageRange: string
  monthlyAmountDisplay: string
}

export type FundingSubmissionLineAsShow = FundingSubmissionLine & {
  ageRange: string
  monthlyAmountDisplay: string
}

export type FundingSubmissionLineWhereOptions = WhereOptions<
  FundingSubmissionLine,
  "id" | "fiscalYear" | "sectionName" | "lineName" | "fromAge" | "toAge"
>

export type FundingSubmissionLineFiltersOptions = FiltersOptions<{
  search: string | string[]
}>

export type FundingSubmissionLineQueryOptions = QueryOptions<
  FundingSubmissionLineWhereOptions,
  FundingSubmissionLineFiltersOptions
>

export const fundingSubmissionLinesApi = {
  async list(params: FundingSubmissionLineQueryOptions = {}): Promise<{
    fundingSubmissionLines: FundingSubmissionLineAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-submission-lines", {
      params,
    })
    return data
  },
  async get(fundingSubmissionLineId: number): Promise<{
    fundingSubmissionLine: FundingSubmissionLineAsShow
    policy: FundingSubmissionLinePolicy
  }> {
    const { data } = await http.get(`/api/funding-submission-lines/${fundingSubmissionLineId}`)
    return data
  },
  async create(attributes: Partial<FundingSubmissionLine>): Promise<{
    fundingSubmissionLine: FundingSubmissionLineAsShow
    policy: FundingSubmissionLinePolicy
  }> {
    const { data } = await http.post("/api/funding-submission-lines", attributes)
    return data
  },
  async update(
    fundingSubmissionLineId: number,
    attributes: Partial<FundingSubmissionLine>
  ): Promise<{
    fundingSubmissionLine: FundingSubmissionLineAsShow
    policy: FundingSubmissionLinePolicy
  }> {
    const { data } = await http.patch(
      `/api/funding-submission-lines/${fundingSubmissionLineId}`,
      attributes
    )
    return data
  },
  async delete(fundingSubmissionLineId: number): Promise<void> {
    const { data } = await http.delete(`/api/funding-submission-lines/${fundingSubmissionLineId}`)
    return data
  },
}

export default fundingSubmissionLinesApi
