import http from "@/api/http-client"

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

export type Params = {
  where?: {
    centreId?: number | number[]
    employeeWageTierId?: number | number[]
  }
}

// TODO: store this in the back-end, probably in the fiscal_periods table
export const EI_CPP_WCB_RATE = 0.14

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

  // Nested Endpoints
  async replicateEstimates(params: { centreId: number; fiscalPeriodId: number }): Promise<void> {
    const { data } = await http.post("/api/wage-enhancements/replicate-estimates", params)
    return data
  },
}

export default wageEnhancementsApi
