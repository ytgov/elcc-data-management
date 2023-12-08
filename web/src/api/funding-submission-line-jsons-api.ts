import http from "@/api/http-client"

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
  dateStart: Date
  dateEnd: Date
  lines: FundingLineValue[]
  createdAt: Date
  updatedAt: Date
}

export type Params = {
  where?: {
    centreId?: number
    fiscalYear?: string
    dateName?: string
  }
  page?: number
  perPage?: number
  otherParams?: any
}

export const fundingSubmissionLineJsonsApi = {
  list(params: Params = {}): Promise<{
    fundingSubmissionLineJsons: FundingSubmissionLineJson[]
  }> {
    return http.get("/api/funding-submission-line-jsons", { params }).then(({ data }) => data)
  },
  get(fundingSubmissionLineJsonId: number) {
    return http
      .get(`/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`)
      .then(({ data }) => data)
  },
  create(
    attributes: Partial<FundingSubmissionLineJson>
  ): Promise<{ fundingSubmissionLineJson: FundingSubmissionLineJson }> {
    return http.post("/api/funding-submission-line-jsons", attributes).then(({ data }) => data)
  },
  update(
    fundingSubmissionLineJsonId: number,
    attributes: any
  ): Promise<{ fundingSubmissionLineJson: FundingSubmissionLineJson }> {
    return http
      .patch(`/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`, attributes)
      .then(({ data }) => data)
  },
  delete(fundingSubmissionLineJsonId: number): Promise<void> {
    return http
      .delete(`/api/funding-submission-line-jsons/${fundingSubmissionLineJsonId}`)
      .then(({ data }) => data)
  },
}

export default fundingSubmissionLineJsonsApi
