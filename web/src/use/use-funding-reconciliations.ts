import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import fundingReconciliationsApi, {
  type FundingReconciliationAsIndex,
  type FundingReconciliationWhereOptions,
  type FundingReconciliationFiltersOptions,
  type FundingReconciliationQueryOptions,
} from "@/api/funding-reconciliations-api"

export {
  type FundingReconciliationAsIndex,
  type FundingReconciliationWhereOptions,
  type FundingReconciliationFiltersOptions,
  type FundingReconciliationQueryOptions,
}

export function useFundingReconciliations(
  queryOptions: Ref<FundingReconciliationQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingReconciliations: FundingReconciliationAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingReconciliations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingReconciliationAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingReconciliations, totalCount } = await fundingReconciliationsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.fundingReconciliations = fundingReconciliations
      state.totalCount = totalCount
      return fundingReconciliations
    } catch (error) {
      console.error(`Failed to fetch funding reconciliations: ${error}`, { error })
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

export default useFundingReconciliations
