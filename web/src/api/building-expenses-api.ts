import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type BuildingExpenseCategoryAsReference } from "@/api/building-expense-categories-api"

export type BuildingExpense = {
  id: number
  buildingExpenseCategoryId: number
  centreId: number
  fiscalPeriodId: number
  subsidyRate: string
  buildingUsagePercent: string
  estimatedCost: string
  actualCost: string
  totalCost: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type BuildingExpensePolicy = Policy

export type BuildingExpenseAsShow = BuildingExpense

export type BuildingExpenseAsIndex = BuildingExpense & {
  category: BuildingExpenseCategoryAsReference
}

export type BuildingExpenseWhereOptions = WhereOptions<
  BuildingExpense,
  "id" | "centreId" | "fiscalPeriodId" | "buildingExpenseCategoryId"
>

export type BuildingExpenseFiltersOptions = FiltersOptions

export type BuildingExpenseQueryOptions = QueryOptions<
  BuildingExpenseWhereOptions,
  BuildingExpenseFiltersOptions
>

export const buildingExpensesApi = {
  async list(params: BuildingExpenseQueryOptions = {}): Promise<{
    buildingExpenses: BuildingExpenseAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/building-expenses", { params })
    return data
  },
  async get(buildingExpenseId: number): Promise<{
    buildingExpense: BuildingExpenseAsShow
    policy: BuildingExpensePolicy
  }> {
    const { data } = await http.get(`/api/building-expenses/${buildingExpenseId}`)
    return data
  },
  async create(attributes: Partial<BuildingExpense>): Promise<{
    buildingExpense: BuildingExpenseAsShow
    policy: BuildingExpensePolicy
  }> {
    const { data } = await http.post("/api/building-expenses", attributes)
    return data
  },
  async update(
    buildingExpenseId: number,
    attributes: Partial<BuildingExpense>
  ): Promise<{
    buildingExpense: BuildingExpenseAsShow
    policy: BuildingExpensePolicy
  }> {
    const { data } = await http.patch(`/api/building-expenses/${buildingExpenseId}`, attributes)
    return data
  },
  async delete(buildingExpenseId: number): Promise<void> {
    const { data } = await http.delete(`/api/building-expenses/${buildingExpenseId}`)
    return data
  },
}

export default buildingExpensesApi
