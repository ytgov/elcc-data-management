import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type EmployeeBenefit = {
  id: number
  centreId: number
  fiscalPeriodId: number
  grossPayrollMonthlyActual: string
  grossPayrollMonthlyEstimated: string
  costCapPercentage: string
  employeeCostActual: string
  employeeCostEstimated: string
  employerCostActual: string
  employerCostEstimated: string
  createdAt: string
  updatedAt: string
}

export type EmployeeBenefitPolicy = Policy

export type EmployeeBenefitAsShow = EmployeeBenefit

export type EmployeeBenefitAsIndex = EmployeeBenefit

export type EmployeeBenefitWhereOptions = WhereOptions<
  EmployeeBenefit,
  "id" | "centreId" | "fiscalPeriodId"
>

export type EmployeeBenefitFiltersOptions = FiltersOptions

export type EmployeeBenefitQueryOptions = QueryOptions<
  EmployeeBenefitWhereOptions,
  EmployeeBenefitFiltersOptions
>

export const employeeBenefitsApi = {
  async list(params: EmployeeBenefitQueryOptions = {}): Promise<{
    employeeBenefits: EmployeeBenefitAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/employee-benefits", { params })
    return data
  },
  async get(employeeBenefitId: number): Promise<{
    employeeBenefit: EmployeeBenefitAsShow
    policy: EmployeeBenefitPolicy
  }> {
    const { data } = await http.get(`/api/employee-benefits/${employeeBenefitId}`)
    return data
  },
  async create(attributes: Partial<EmployeeBenefit>): Promise<{
    employeeBenefit: EmployeeBenefitAsShow
    policy: EmployeeBenefitPolicy
  }> {
    const { data } = await http.post("/api/employee-benefits", attributes)
    return data
  },
  async update(
    employeeBenefitId: number,
    attributes: Partial<EmployeeBenefit>
  ): Promise<{
    employeeBenefit: EmployeeBenefitAsShow
    policy: EmployeeBenefitPolicy
  }> {
    const { data } = await http.patch(`/api/employee-benefits/${employeeBenefitId}`, attributes)
    return data
  },
  async delete(employeeBenefitId: number): Promise<void> {
    const { data } = await http.delete(`/api/employee-benefits/${employeeBenefitId}`)
    return data
  },
}

export default employeeBenefitsApi
