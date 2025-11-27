import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type FundingReconciliationAdjustment } from "@/api/funding-reconciliation-adjustments-api"

export type FundingReconciliation = {
  id: number
  centreId: number
  fundingPeriodId: number
  status: string
  fundingReceivedTotalAmount: string
  eligibleExpensesTotalAmount: string
  payrollAdjustmentsTotalAmount: string
  finalBalanceAmount: string
  notes: string | null
  finalizedAt: string | null
  finalizedById: number | null
  createdAt: string
  updatedAt: string
}

export type FundingReconciliationPolicy = Policy

export type FundingReconciliationAsShow = FundingReconciliation & {
  adjustments: FundingReconciliationAdjustment[]
}

export type FundingReconciliationAsIndex = FundingReconciliation

export type FundingReconciliationWhereOptions = WhereOptions<
  FundingReconciliation,
  "id" | "centreId" | "fundingPeriodId" | "status"
>

export type FundingReconciliationFiltersOptions = FiltersOptions<{
  byFiscalYearLong: string
}>

export type FundingReconciliationQueryOptions = QueryOptions<
  FundingReconciliationWhereOptions,
  FundingReconciliationFiltersOptions
>

export const fundingReconciliationsApi = {
  async list(params: FundingReconciliationQueryOptions = {}): Promise<{
    fundingReconciliations: FundingReconciliationAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/funding-reconciliations", { params })
    return data
  },
  async get(fundingReconciliationId: number): Promise<{
    fundingReconciliation: FundingReconciliationAsShow
    policy: Policy
  }> {
    const { data } = await http.get(`/api/funding-reconciliations/${fundingReconciliationId}`)
    return data
  },
  async create(attributes: Partial<FundingReconciliation>): Promise<{
    fundingReconciliation: FundingReconciliationAsShow
    policy: Policy
  }> {
    const { data } = await http.post("/api/funding-reconciliations", attributes)
    return data
  },
  async update(
    fundingReconciliationId: number,
    attributes: Partial<FundingReconciliation>
  ): Promise<{
    fundingReconciliation: FundingReconciliationAsShow
    policy: Policy
  }> {
    const { data } = await http.patch(
      `/api/funding-reconciliations/${fundingReconciliationId}`,
      attributes
    )
    return data
  },
  async delete(fundingReconciliationId: number): Promise<void> {
    const { data } = await http.delete(`/api/funding-reconciliations/${fundingReconciliationId}`)
    return data
  },
}

export default fundingReconciliationsApi
