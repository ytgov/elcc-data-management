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

export type Params = {
  where?: {
    centreId?: number
    fiscalPeriodId?: string
  }
  page?: number
  perPage?: number
  otherParams?: any
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
