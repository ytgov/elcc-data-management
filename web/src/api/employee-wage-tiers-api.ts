import http from "@/api/http-client"

import { FiscalPeriod } from "@/api/fiscal-periods-api"

export type EmployeeWageTier = {
  id: number
  fiscalPeriodId: FiscalPeriod["id"]
  tierLevel: number
  tierLabel: string
  wageRatePerHour: number
  createdAt: Date
  updatedAt: Date
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
