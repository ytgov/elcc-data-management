import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import fundingPeriodsApi, {
  type FundingPeriodAsIndex,
  type FundingPeriodFiltersOptions,
  type FundingPeriodQueryOptions,
  type FundingPeriodWhereOptions,
} from "@/api/funding-periods-api"

export {
  type FundingPeriodAsIndex,
  type FundingPeriodFiltersOptions,
  type FundingPeriodQueryOptions,
  type FundingPeriodWhereOptions,
}

export function useFundingPeriods(
  queryOptions: Ref<FundingPeriodQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingPeriods: FundingPeriodAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingPeriods: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingPeriodAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingPeriods, totalCount } = await fundingPeriodsApi.list(unref(queryOptions))
      state.isErrored = false
      state.fundingPeriods = fundingPeriods
      state.totalCount = totalCount
      return fundingPeriods
    } catch (error) {
      console.error(`Failed to fetch funding periods: ${error}`, { error })
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

export default useFundingPeriods
