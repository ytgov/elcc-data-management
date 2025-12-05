import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type BuildingExpenseCategory = {
  id: number
  fundingRegionId: number
  categoryName: string
  subsidyRate: string
  createdAt: string
  updatedAt: string
}

export type BuildingExpenseCategoryPolicy = Policy

export type BuildingExpenseCategoryAsShow = BuildingExpenseCategory

export type BuildingExpenseCategoryAsIndex = BuildingExpenseCategory

export type BuildingExpenseCategoryAsReference = BuildingExpenseCategory

export type BuildingExpenseCategoryWhereOptions = WhereOptions<
  BuildingExpenseCategory,
  "id" | "fundingRegionId" | "categoryName"
>

export type BuildingExpenseCategoryFiltersOptions = FiltersOptions<{
  search: string
}>

export type BuildingExpenseCategoryQueryOptions = QueryOptions<
  BuildingExpenseCategoryWhereOptions,
  BuildingExpenseCategoryFiltersOptions
>

export const buildingExpenseCategoriesApi = {
  async list(params: BuildingExpenseCategoryQueryOptions = {}): Promise<{
    buildingExpenseCategories: BuildingExpenseCategoryAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/building-expense-categories", {
      params,
    })
    return data
  },
  async get(buildingExpenseCategoryId: number): Promise<{
    buildingExpenseCategory: BuildingExpenseCategoryAsShow
    policy: BuildingExpenseCategoryPolicy
  }> {
    const { data } = await http.get(`/api/building-expense-categories/${buildingExpenseCategoryId}`)
    return data
  },
  async create(attributes: Partial<BuildingExpenseCategory>): Promise<{
    buildingExpenseCategory: BuildingExpenseCategoryAsShow
    policy: BuildingExpenseCategoryPolicy
  }> {
    const { data } = await http.post("/api/building-expense-categories", attributes)
    return data
  },
  async update(
    buildingExpenseCategoryId: number,
    attributes: Partial<BuildingExpenseCategory>
  ): Promise<{
    buildingExpenseCategory: BuildingExpenseCategoryAsShow
    policy: BuildingExpenseCategoryPolicy
  }> {
    const { data } = await http.patch(
      `/api/building-expense-categories/${buildingExpenseCategoryId}`,
      attributes
    )
    return data
  },
  async delete(buildingExpenseCategoryId: number): Promise<void> {
    const { data } = await http.delete(
      `/api/building-expense-categories/${buildingExpenseCategoryId}`
    )
    return data
  },
}

export default buildingExpenseCategoriesApi
