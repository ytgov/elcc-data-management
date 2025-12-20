import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

// Keep in sync with api/src/models/employee-wage-tier.ts
export type EmployeeWageTier = {
  id: number
  fiscalPeriodId: number
  tierLevel: number
  tierLabel: string
  wageRatePerHour: string
  createdAt: string
  updatedAt: string
}

export type EmployeeWageTierAsIndex = EmployeeWageTier

export type EmployeeWageTierAsShow = EmployeeWageTier

export type EmployeeWageTierPolicy = Policy

export type EmployeeWageTierWhereOptions = WhereOptions<
  EmployeeWageTier,
  "fiscalPeriodId"
>

export type EmployeeWageTierFiltersOptions = FiltersOptions

export type EmployeeWageTierQueryOptions = QueryOptions<
  EmployeeWageTierWhereOptions,
  EmployeeWageTierFiltersOptions
>

export const employeeWageTiersApi = {
  async list(params: EmployeeWageTierQueryOptions = {}): Promise<{
    employeeWageTiers: EmployeeWageTierAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/employee-wage-tiers", { params })
    return data
  },

  async get(employeeWageTierId: number): Promise<{
    employeeWageTier: EmployeeWageTierAsShow
    policy: EmployeeWageTierPolicy
  }> {
    const { data } = await http.get(`/api/employee-wage-tiers/${employeeWageTierId}`)
    return data
  },
}

export default employeeWageTiersApi
