import http from "@/api/http-client"
import {
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineQueryOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/api/funding-submission-lines-api"

export type SectionNamesWhereOptions = FundingSubmissionLineWhereOptions
export type SectionNamesFiltersOptions = FundingSubmissionLineFiltersOptions
export type SectionNamesQueryOptions = FundingSubmissionLineQueryOptions

export const sectionNamesApi = {
  async list(params: SectionNamesQueryOptions = {}): Promise<{
    sectionNames: string[]
  }> {
    const { data } = await http.get("/api/funding-submission-lines/section-names", { params })
    return data
  },
}

export default sectionNamesApi
