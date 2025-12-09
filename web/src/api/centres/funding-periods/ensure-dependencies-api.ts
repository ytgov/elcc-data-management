import http from "@/api/http-client"

export const ensureDependenciesApi = {
  async create(centreId: number, fundingPeriodId: number): Promise<void> {
    await http.post(
      `/api/centres/${centreId}/funding-periods/${fundingPeriodId}/ensure-dependencies`
    )
  },
}
