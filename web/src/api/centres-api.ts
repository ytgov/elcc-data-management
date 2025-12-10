import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export enum CentreStatuses {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  UP_TO_DATE = "Up to date",
}

// Keep in sync with api/src/models/centre.ts
export type Centre = {
  id: number
  fundingRegionId: number
  name: string
  community: string
  status: string
  isFirstNationProgram: boolean
  license: string | null
  hotMeal: boolean | null
  licensedFor: number | null
  licenseHolderName: string | null
  contactName: string | null
  physicalAddress: string | null
  mailingAddress: string | null
  email: string | null
  altEmail: string | null
  phoneNumber: string | null
  altPhoneNumber: string | null
  faxNumber: string | null
  vendorIdentifier: string | null
  inspectorName: string | null
  neighborhood: string | null
  lastSubmission: string | null
  buildingUsagePercent: string
  createdAt: string
  updatedAt: string
}

export type CentreAsShow = Centre

export type CentreAsIndex = Pick<
  Centre,
  | "id"
  | "fundingRegionId"
  | "name"
  | "license"
  | "community"
  | "isFirstNationProgram"
  | "status"
  | "hotMeal"
  | "licensedFor"
  | "buildingUsagePercent"
  | "lastSubmission"
  | "createdAt"
  | "updatedAt"
>

export type CentrePolicy = Policy

export type CentreWhereOptions = WhereOptions<
  Centre,
  "fundingRegionId" | "status" | "isFirstNationProgram" | "hotMeal"
>

export type CentreFiltersOptions = FiltersOptions<{
  search: string | string[]
}>

export type CentreQueryOptions = QueryOptions<CentreWhereOptions, CentreFiltersOptions>

export const centresApi = {
  async list(params: CentreQueryOptions = {}): Promise<{
    centres: CentreAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/centres", { params })
    return data
  },
  async get(centreId: number): Promise<{
    centre: CentreAsShow
    policy: CentrePolicy
  }> {
    const { data } = await http.get(`/api/centres/${centreId}`)
    return data
  },
  async create(attributes: Partial<Centre>): Promise<{
    centre: CentreAsShow
    policy: CentrePolicy
  }> {
    const { data } = await http.post("/api/centres", attributes)
    return data
  },
  async update(
    centreId: number,
    attributes: Partial<Centre>
  ): Promise<{
    centre: CentreAsShow
    policy: CentrePolicy
  }> {
    const { data } = await http.patch(`/api/centres/${centreId}`, attributes)
    return data
  },
  async delete(centreId: number): Promise<void> {
    const { data } = await http.delete(`/api/centres/${centreId}`)
    return data
  },
}

export default centresApi
