import http from "@/api/http-client"

export type InitializationStatus = {
  hasEmployeeBenefits: boolean
  hasBuildingExpenses: boolean
  hasFundingSubmissionLineJsons: boolean
  hasFundingReconciliation: boolean
  isInitialized: boolean
}

export const initializeApi = {
  async get(
    centreId: number,
    fundingPeriodId: number
  ): Promise<{
    initializationStatus: InitializationStatus
  }> {
    const { data } = await http.get(
      `/api/centres/${centreId}/funding-periods/${fundingPeriodId}/initialize`
    )
    return data
  },

  async create(
    centreId: number,
    fundingPeriodId: number
  ): Promise<{
    initializationStatus: InitializationStatus
  }> {
    const { data } = await http.post(
      `/api/centres/${centreId}/funding-periods/${fundingPeriodId}/initialize`
    )
    return data
  },
}
