import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import fundingReconciliationAdjustmentsApi, {
  type FundingReconciliationAdjustmentAsIndex,
  type FundingReconciliationAdjustmentWhereOptions,
  type FundingReconciliationAdjustmentFiltersOptions,
  type FundingReconciliationAdjustmentQueryOptions,
} from "@/api/funding-reconciliation-adjustments-api"

export {
  type FundingReconciliationAdjustmentAsIndex,
  type FundingReconciliationAdjustmentWhereOptions,
  type FundingReconciliationAdjustmentFiltersOptions,
  type FundingReconciliationAdjustmentQueryOptions,
}

export function useFundingReconciliationAdjustments(
  queryOptions: Ref<FundingReconciliationAdjustmentQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingReconciliationAdjustments: FundingReconciliationAdjustmentAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingReconciliationAdjustments: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingReconciliationAdjustmentAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingReconciliationAdjustments, totalCount } =
        await fundingReconciliationAdjustmentsApi.list(unref(queryOptions))
      state.isErrored = false
      state.fundingReconciliationAdjustments = fundingReconciliationAdjustments
      state.totalCount = totalCount
      return fundingReconciliationAdjustments
    } catch (error) {
      console.error(`Failed to fetch funding reconciliation adjustments: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useFundingReconciliationAdjustments
