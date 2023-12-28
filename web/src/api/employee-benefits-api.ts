import http from "@/api/http-client"

export type EmployeeBenefit = {
  id: number
  centreId: number
  fiscalPeriodId: number
  grossPayrollMonthlyActual: number
  grossPayrollMonthlyEstimated: number
  costCapPercentage: number
  employeeCostActual: number
  employeeCostEstimated: number
  employerCostActual: number
  employerCostEstimated: number
  createdAt: Date
  updatedAt: Date
}

export type NonPersistedEmployeeBenefit = Omit<EmployeeBenefit, "id" | "createdAt" | "updatedAt">

export type Params = {
  where?: {
    centreId?: EmployeeBenefit["centreId"]
    fiscalPeriodId?: EmployeeBenefit["fiscalPeriodId"] | EmployeeBenefit["fiscalPeriodId"][]
  }
  page?: number
  perPage?: number
}

export function isPersistedEmployeeBenefit(
  employeeBenefit: EmployeeBenefit | NonPersistedEmployeeBenefit
): employeeBenefit is EmployeeBenefit {
  return "id" in employeeBenefit && employeeBenefit.id !== undefined
}

export const employeeBenefitsApi = {
  list(params: Params = {}): Promise<{
    employeeBenefits: EmployeeBenefit[]
  }> {
    return http.get("/api/employee-benefits", { params }).then(({ data }) => data)
  },
  get(employeeBenefitId: number) {
    return http.get(`/api/employee-benefits/${employeeBenefitId}`).then(({ data }) => data)
  },
  create(attributes: Partial<EmployeeBenefit>): Promise<{ employeeBenefit: EmployeeBenefit }> {
    return http.post("/api/employee-benefits", attributes).then(({ data }) => data)
  },
  update(
    employeeBenefitId: number,
    attributes: any
  ): Promise<{ employeeBenefit: EmployeeBenefit }> {
    return http
      .patch(`/api/employee-benefits/${employeeBenefitId}`, attributes)
      .then(({ data }) => data)
  },
  delete(employeeBenefitId: number): Promise<void> {
    return http.delete(`/api/employee-benefits/${employeeBenefitId}`).then(({ data }) => data)
  },
}

export default employeeBenefitsApi
