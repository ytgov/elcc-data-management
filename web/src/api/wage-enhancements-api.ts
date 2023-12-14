import http from "@/api/http-client"

import { type Centre } from "./centres-api"
import { type EmployeeWageTier } from "./employee-wage-tiers-api"

export type WageEnhancement = {
  id: number
  centreId: Centre["id"]
  employeeWageTierId: EmployeeWageTier["id"]
  employeeName: string
  hoursEstimated: number
  hoursActual: number
  createdAt: Date
  updatedAt: Date
}

export type Params = {
  where?: {
    centreId?: WageEnhancement["centreId"]
    employeeWageTierId?: WageEnhancement["employeeWageTierId"]
  }
}

export const wageEnhancementsApi = {
  list(params: Params = {}): Promise<{
    wageEnhancements: WageEnhancement[]
  }> {
    return http.get("/api/wage-enhancements", { params }).then(({ data }) => data)
  },
  get(wageEnhancementId: number) {
    return http.get(`/api/wage-enhancements/${wageEnhancementId}`).then(({ data }) => data)
  },
  create(attributes: Partial<WageEnhancement>): Promise<{ wageEnhancement: WageEnhancement }> {
    return http.post("/api/wage-enhancements", attributes).then(({ data }) => data)
  },
  update(
    wageEnhancementId: number,
    attributes: Partial<WageEnhancement>
  ): Promise<{ wageEnhancement: WageEnhancement }> {
    return http
      .patch(`/api/wage-enhancements/${wageEnhancementId}`, attributes)
      .then(({ data }) => data)
  },
  delete(wageEnhancementId: number): Promise<void> {
    return http.delete(`/api/wage-enhancements/${wageEnhancementId}`).then(({ data }) => data)
  },
}

export default wageEnhancementsApi
