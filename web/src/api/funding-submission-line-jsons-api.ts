import http from "@/api/http-client"
import { type FiltersOptions, type QueryOptions, type WhereOptions } from "@/api/base-api"

export type FundingLineValue = {
  submissionLineId: number
  sectionName: string
  lineName: string
  monthlyAmount: number
  estimatedChildOccupancyRate: number
  actualChildOccupancyRate: number
  estimatedComputedTotal: number
  actualComputedTotal: number
}

export type FundingSubmissionLineJson = {
  id: number
  centreId: number
  fiscalYear: string
  dateName: string
  dateStart: string
  dateEnd: string
  values: string
  createdAt: string
  updatedAt: string

  // Virtual Attributes
  lines: FundingLineValue[]
}

export type FundingSubmissionLineJsonAsIndex = Omit<FundingSubmissionLineJson, "values">
export type FundingSubmissionLineJsonAsDetailed = Omit<FundingSubmissionLineJson, "values">

export type FundingSubmissionLineJsonWhereOptions = WhereOptions<
  FundingSubmissionLineJson,
  "centreId" | "fiscalYear" | "dateName" | "dateStart" | "dateEnd"
>

export type FundingSubmissionLineJsonFiltersOptions = FiltersOptions<{
  withChildOccupancyRate: string
}>

export type FundingSubmissionLineJsonQueryOptions = QueryOptions<
  FundingSubmissionLineJsonWhereOptions,
  FundingSubmissionLineJsonFiltersOptions
>

export const fundingSubmissionLineJsonsApi = {
  async list(params: FundingSubmissionLineJsonQueryOptions = {}): Promise<{
    fundingSubmissionLineJsons: FundingSubmissionLineJsonAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-submission-line-jsons", { params })
    return data
  },
  async get(fundingSubmissionLineJsonId: number): Promise<{
    fundingSubmissionLineJson: FundingSubmissionLineJsonAsDetailed
  }> {
    const { data } = await http.get(
      `/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`
    )
    return data
  },
  async create(
    attributes: Partial<FundingSubmissionLineJson>
  ): Promise<{ fundingSubmissionLineJson: FundingSubmissionLineJsonAsDetailed }> {
    const { data } = await http.post("/api/funding-submission-line-jsons", attributes)
    return data
  },
  async update(
    fundingSubmissionLineJsonId: number,
    attributes: Partial<FundingSubmissionLineJson>
  ): Promise<{ fundingSubmissionLineJson: FundingSubmissionLineJsonAsDetailed }> {
    const { data } = await http.patch(
      `/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`,
      attributes
    )
    return data
  },
  async delete(fundingSubmissionLineJsonId: number): Promise<void> {
    const { data } = await http.delete(
      `/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`
    )
    return data
  },

  // Nested endpoints
  async replicateEstimates(fundingSubmissionLineJsonId: number): Promise<void> {
    const { data } = await http.post(
      `/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}/replicate-estimates`
    )
    return data
  },
}

export default fundingSubmissionLineJsonsApi
