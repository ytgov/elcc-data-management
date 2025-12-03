import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type FundingReconciliationAdjustment = {
  id: number
  fundingReconciliationId: number
  fiscalPeriodId: number
  fundingReceivedPeriodAmount: string
  eligibleExpensesPeriodAmount: string
  payrollAdjustmentsPeriodAmount: string
  cumulativeBalanceAmount: string
  createdAt: string
  updatedAt: string
}

export type FundingReconciliationAdjustmentPolicy = Policy

export type FundingReconciliationAdjustmentAsShow = FundingReconciliationAdjustment

export type FundingReconciliationAdjustmentAsIndex = FundingReconciliationAdjustment

export type FundingReconciliationAdjustmentWhereOptions = WhereOptions<
  FundingReconciliationAdjustment,
  "id" | "fundingReconciliationId" | "fiscalPeriodId"
>

export type FundingReconciliationAdjustmentFiltersOptions = FiltersOptions

export type FundingReconciliationAdjustmentQueryOptions = QueryOptions<
  FundingReconciliationAdjustmentWhereOptions,
  FundingReconciliationAdjustmentFiltersOptions
>

export const fundingReconciliationAdjustmentsApi = {
  async list(params: FundingReconciliationAdjustmentQueryOptions = {}): Promise<{
    fundingReconciliationAdjustments: FundingReconciliationAdjustmentAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-reconciliation-adjustments", { params })
    return data
  },
  async get(fundingReconciliationAdjustmentId: number): Promise<{
    fundingReconciliationAdjustment: FundingReconciliationAdjustmentAsShow
    policy: Policy
  }> {
    const { data } = await http.get(
      `/api/funding-reconciliation-adjustments/${fundingReconciliationAdjustmentId}`
    )
    return data
  },
  async create(attributes: Partial<FundingReconciliationAdjustment>): Promise<{
    fundingReconciliationAdjustment: FundingReconciliationAdjustmentAsShow
    policy: Policy
  }> {
    const { data } = await http.post("/api/funding-reconciliation-adjustments", attributes)
    return data
  },
  async update(
    fundingReconciliationAdjustmentId: number,
    attributes: Partial<FundingReconciliationAdjustment>
  ): Promise<{
    fundingReconciliationAdjustment: FundingReconciliationAdjustmentAsShow
    policy: Policy
  }> {
    const { data } = await http.patch(
      `/api/funding-reconciliation-adjustments/${fundingReconciliationAdjustmentId}`,
      attributes
    )
    return data
  },
  async delete(fundingReconciliationAdjustmentId: number): Promise<void> {
    const { data } = await http.delete(
      `/api/funding-reconciliation-adjustments/${fundingReconciliationAdjustmentId}`
    )
    return data
  },
}

export default fundingReconciliationAdjustmentsApi
