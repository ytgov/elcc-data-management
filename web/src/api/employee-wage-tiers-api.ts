import http from "@/api/http-client"

export type EmployeeWageTier = {
  id: number
  fiscalPeriodId: number
  tierLevel: number
  tierLabel: string
  wageRatePerHour: string
  createdAt: string
  updatedAt: string
}

export type Params = {
  where?: {
    fiscalPeriodId?: EmployeeWageTier["fiscalPeriodId"]
  }
}

export const employeeWageTiersApi = {
  list(params: Params = {}): Promise<{
    employeeWageTiers: EmployeeWageTier[]
  }> {
    return http.get("/api/employee-wage-tiers", { params }).then(({ data }) => data)
  },
}

export default employeeWageTiersApi
