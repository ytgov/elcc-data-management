import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { type FundingReconciliationAsShow } from "@/api/funding-reconciliations-api"

export const refreshApi = {
  async create(fundingReconciliationId: number): Promise<{
    fundingReconciliation: FundingReconciliationAsShow
    policy: Policy
  }> {
    const { data } = await http.post(
      `/api/funding-reconciliations/${fundingReconciliationId}/refresh`
    )
    return data
  },
}
