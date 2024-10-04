import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingSubmissionLineJsonsApi, {
  type FundingSubmissionLineJsonAsDetailed,
} from "@/api/funding-submission-line-jsons-api"

export { type FundingSubmissionLineJsonAsDetailed }

export function useFundingSubmissionLineJsonAsDetailed(id: Ref<number | null | undefined>) {
  const state = reactive<{
    fundingSubmissionLineJson: FundingSubmissionLineJsonAsDetailed | null
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingSubmissionLineJson: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingSubmissionLineJsonAsDetailed> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { fundingSubmissionLineJson } = await fundingSubmissionLineJsonsApi.get(staticId)
      state.isErrored = false
      state.fundingSubmissionLineJson = fundingSubmissionLineJson
      return fundingSubmissionLineJson
    } catch (error) {
      console.error("Failed to fetch funding submission line json:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useFundingSubmissionLineJsonAsDetailed
