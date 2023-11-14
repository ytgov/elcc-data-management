import { defineStore } from "pinia"
import { isNil } from "lodash"
import { ref, type Ref } from "vue"

import fundingSubmissionLineJsonsApi, {
  type FundingLineValue,
  type FundingSubmissionLineJson,
  type Params,
} from "@/api/funding-submission-line-jsons-api"

export { type FundingLineValue, type FundingSubmissionLineJson, type Params }

export const useFundingSubmissionLineJsonsStore = defineStore("fundingSubmissionLineJsons", () => {
  const items: Ref<FundingSubmissionLineJson[]> = ref([])
  // TODO: Implement total_count here and in the back-end
  const isLoading = ref(false)
  const isErrored = ref(false)
  const isInitialized = ref(false)

  async function initialize(params: Params = {}): Promise<FundingSubmissionLineJson[]> {
    if (isInitialized.value) return items.value

    return fetch(params)
  }

  async function fetch(params: Params = {}): Promise<FundingSubmissionLineJson[]> {
    isLoading.value = true
    try {
      const { fundingSubmissionLineJsons } = await fundingSubmissionLineJsonsApi.list(params)
      isErrored.value = false
      items.value = fundingSubmissionLineJsons
      isInitialized.value = true
      return fundingSubmissionLineJsons
    } catch (error) {
      console.error("Failed to fetch fundingSubmissionLineJsons:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function linesForMonth(dateName: string): FundingLineValue[] | undefined {
    const itemForMonth = items.value.find((time) => time.dateName === dateName)

    if (isNil(itemForMonth)) {
      console.error(`Could not find funding submission line json for month ${dateName}`)
      return
    }

    return itemForMonth.lines
  }

  return {
    items,
    isLoading,
    isErrored,
    isInitialized,
    initialize,
    fetch,
    linesForMonth,
  }
})

export default useFundingSubmissionLineJsonsStore
