import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import fundingRegionsApi, {
  type FundingRegionAsIndex,
  type FundingRegionFiltersOptions,
  type FundingRegionQueryOptions,
  type FundingRegionWhereOptions,
} from "@/api/funding-regions-api"

export {
  type FundingRegionAsIndex,
  type FundingRegionFiltersOptions,
  type FundingRegionQueryOptions,
  type FundingRegionWhereOptions,
}

export function useFundingRegions(
  queryOptions: Ref<FundingRegionQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingRegions: FundingRegionAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingRegions: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingRegionAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingRegions, totalCount } = await fundingRegionsApi.list(unref(queryOptions))
      state.isErrored = false
      state.fundingRegions = fundingRegions
      state.totalCount = totalCount

      return fundingRegions
    } catch (error) {
      console.error(`Failed to fetch funding regions: ${error}`, { error })
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

export default useFundingRegions
