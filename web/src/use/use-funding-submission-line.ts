import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingSubmissionLinesApi, {
  type FundingSubmissionLineAsShow,
  type FundingSubmissionLinePolicy,
} from "@/api/funding-submission-lines-api"

export { type FundingSubmissionLineAsShow, type FundingSubmissionLinePolicy }

export function useFundingSubmissionLine(fundingSubmissionLineId: Ref<number | null | undefined>) {
  const state = reactive<{
    fundingSubmissionLine: FundingSubmissionLineAsShow | null
    policy: FundingSubmissionLinePolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingSubmissionLine: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingSubmissionLineAsShow> {
    const staticFundingSubmissionLineId = unref(fundingSubmissionLineId)

    if (isNil(staticFundingSubmissionLineId)) {
      throw new Error("fundingSubmissionLineId is required")
    }

    state.isLoading = true
    try {
      const { fundingSubmissionLine, policy } = await fundingSubmissionLinesApi.get(
        staticFundingSubmissionLineId
      )
      state.isErrored = false
      state.fundingSubmissionLine = fundingSubmissionLine
      state.policy = policy
      return fundingSubmissionLine
    } catch (error) {
      console.error(`Failed to fetch funding submission line: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<FundingSubmissionLineAsShow> {
    const staticFundingSubmissionLineId = unref(fundingSubmissionLineId)

    if (isNil(staticFundingSubmissionLineId)) {
      throw new Error("fundingSubmissionLineId is required")
    }

    if (isNil(state.fundingSubmissionLine)) {
      throw new Error("fundingSubmissionLine is required")
    }

    state.isLoading = true
    try {
      const { fundingSubmissionLine, policy } = await fundingSubmissionLinesApi.update(
        staticFundingSubmissionLineId,
        state.fundingSubmissionLine
      )
      state.isErrored = false
      state.fundingSubmissionLine = fundingSubmissionLine
      state.policy = policy
      return fundingSubmissionLine
    } catch (error) {
      console.error(`Failed to save funding submission line: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(fundingSubmissionLineId),
    async (newFundingSubmissionLineId) => {
      if (isNil(newFundingSubmissionLineId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    save,
  }
}

export default useFundingSubmissionLine
