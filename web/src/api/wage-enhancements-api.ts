import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type EmployeeWageTierAsReference } from "@/api/employee-wage-tiers-api"

// TODO: store this in the back-end, probably in the fiscal_periods table
export const EI_CPP_WCB_RATE = 0.14

// Keep in sync with api/src/models/wage-enhancement.ts
export type WageEnhancement = {
  id: number
  centreId: number
  employeeWageTierId: number
  employeeName: string
  hoursEstimated: string
  hoursActual: string
  createdAt: string
  updatedAt: string
}

export type WageEnhancementAsIndex = WageEnhancement & {
  employeeWageTier: EmployeeWageTierAsReference
}

export type WageEnhancementAsShow = WageEnhancement & {
  employeeWageTier: EmployeeWageTierAsReference
}

export type WageEnhancementPolicy = Policy

export type WageEnhancementWhereOptions = WhereOptions<
  WageEnhancement,
  "centreId" | "employeeWageTierId"
>

export type WageEnhancementFiltersOptions = FiltersOptions

export type WageEnhancementQueryOptions = QueryOptions<
  WageEnhancementWhereOptions,
  WageEnhancementFiltersOptions
>

export const wageEnhancementsApi = {
  async list(params: WageEnhancementQueryOptions = {}): Promise<{
    wageEnhancements: WageEnhancementAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/wage-enhancements", { params })
    return data
  },
  async get(wageEnhancementId: number): Promise<{
    wageEnhancement: WageEnhancementAsShow
    policy: WageEnhancementPolicy
  }> {
    const { data } = await http.get(`/api/wage-enhancements/${wageEnhancementId}`)
    return data
  },
  async create(attributes: Partial<WageEnhancement>): Promise<{
    wageEnhancement: WageEnhancementAsShow
    policy: WageEnhancementPolicy
  }> {
    const { data } = await http.post("/api/wage-enhancements", attributes)
    return data
  },
  async update(
    wageEnhancementId: number,
    attributes: Partial<WageEnhancement>
  ): Promise<{
    wageEnhancement: WageEnhancementAsShow
    policy: WageEnhancementPolicy
  }> {
    const { data } = await http.patch(`/api/wage-enhancements/${wageEnhancementId}`, attributes)
    return data
  },
  async delete(wageEnhancementId: number): Promise<void> {
    const { data } = await http.delete(`/api/wage-enhancements/${wageEnhancementId}`)
    return data
  },

  // Nested Endpoints
  async replicateEstimates(params: { centreId: number; fiscalPeriodId: number }): Promise<void> {
    const { data } = await http.post("/api/wage-enhancements/replicate-estimates", params)
    return data
  },
}

export default wageEnhancementsApi
