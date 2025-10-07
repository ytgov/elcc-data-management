import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import fundingSubmissionLinesApi, {
  type FundingSubmissionLineAsIndex,
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineQueryOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/api/funding-submission-lines-api"

export {
  type FundingSubmissionLineAsIndex,
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineQueryOptions,
  type FundingSubmissionLineWhereOptions,
}

export function useFundingSubmissionLines(
  queryOptions: Ref<FundingSubmissionLineQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fundingSubmissionLines: FundingSubmissionLineAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingSubmissionLines: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingSubmissionLineAsIndex[]> {
    state.isLoading = true
    try {
      const { fundingSubmissionLines, totalCount } = await fundingSubmissionLinesApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.fundingSubmissionLines = fundingSubmissionLines
      state.totalCount = totalCount
      return fundingSubmissionLines
    } catch (error) {
      console.error(`Failed to fetch funding submission lines: ${error}`, { error })
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

export default useFundingSubmissionLines
