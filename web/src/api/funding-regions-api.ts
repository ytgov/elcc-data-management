import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type FundingRegion = {
  id: number
  region: string
  subsidyRate: string
  createdAt: string
  updatedAt: string
}

export type FundingRegionPolicy = Policy

export type FundingRegionAsShow = FundingRegion

export type FundingRegionAsIndex = FundingRegion

export type FundingRegionAsReference = FundingRegion

export type FundingRegionWhereOptions = WhereOptions<FundingRegion, "id" | "region">

export type FundingRegionFiltersOptions = FiltersOptions<{
  search: string
  excludingIds: number[]
}>

export type FundingRegionQueryOptions = QueryOptions<
  FundingRegionWhereOptions,
  FundingRegionFiltersOptions
>

export const fundingRegionsApi = {
  async list(params: FundingRegionQueryOptions = {}): Promise<{
    fundingRegions: FundingRegionAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-regions", {
      params,
    })

    return data
  },
  async get(fundingRegionId: number): Promise<{
    fundingRegion: FundingRegionAsShow
    policy: FundingRegionPolicy
  }> {
    const { data } = await http.get(`/api/funding-regions/${fundingRegionId}`)

    return data
  },
  async create(attributes: Partial<FundingRegion>): Promise<{
    fundingRegion: FundingRegionAsShow
    policy: FundingRegionPolicy
  }> {
    const { data } = await http.post("/api/funding-regions", attributes)

    return data
  },
  async update(
    fundingRegionId: number,
    attributes: Partial<FundingRegion>
  ): Promise<{
    fundingRegion: FundingRegionAsShow
    policy: FundingRegionPolicy
  }> {
    const { data } = await http.patch(`/api/funding-regions/${fundingRegionId}`, attributes)

    return data
  },
  async delete(fundingRegionId: number): Promise<void> {
    const { data } = await http.delete(`/api/funding-regions/${fundingRegionId}`)

    return data
  },
}

export default fundingRegionsApi
