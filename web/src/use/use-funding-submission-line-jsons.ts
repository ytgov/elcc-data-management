import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingSubmissionLineJsonsApi, {
  type FundingLineValue,
  type FundingSubmissionLineJsonAsIndex,
  type FundingSubmissionLineJsonFiltersOptions,
  type FundingSubmissionLineJsonWhereOptions,
  type FundingSubmissionLineJsonQueryOptions,
} from "@/api/funding-submission-line-jsons-api"

export {
  type FundingLineValue,
  type FundingSubmissionLineJsonAsIndex,
  type FundingSubmissionLineJsonWhereOptions,
  type FundingSubmissionLineJsonFiltersOptions,
  type FundingSubmissionLineJsonQueryOptions,
}

export function useFundingSubmissionLineJsons(
  queryOptions: Ref<FundingSubmissionLineJsonQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingSubmissionLineJsons: FundingSubmissionLineJsonAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingSubmissionLineJsons: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  function linesForMonth(dateName: string): FundingLineValue[] | undefined {
    const itemForMonth = state.fundingSubmissionLineJsons.find((time) => time.dateName === dateName)

    if (isNil(itemForMonth)) return

    return itemForMonth.lines
  }

  async function fetch(): Promise<FundingSubmissionLineJsonAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingSubmissionLineJsons, totalCount } = await fundingSubmissionLineJsonsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.fundingSubmissionLineJsons = fundingSubmissionLineJsons
      state.totalCount = totalCount
      return fundingSubmissionLineJsons
    } catch (error) {
      console.error(`Failed to fetch funding submission line jsons: ${error}`, { error })
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
    // Special methods
    linesForMonth,
  }
}

export default useFundingSubmissionLineJsons
