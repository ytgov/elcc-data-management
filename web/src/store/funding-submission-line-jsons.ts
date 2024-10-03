import { defineStore } from "pinia"
import { isNil } from "lodash"
import { ref, type Ref } from "vue"

import fundingSubmissionLineJsonsApi, {
  type FundingSubmissionLineJsonFiltersOptions,
  type FundingSubmissionLineJsonWhereOptions,
  type FundingLineValue,
  type FundingSubmissionLineJsonAsIndex,
} from "@/api/funding-submission-line-jsons-api"

export {
  type FundingLineValue,
  type FundingSubmissionLineJsonAsIndex,
  type FundingSubmissionLineJsonFiltersOptions,
  type FundingSubmissionLineJsonWhereOptions,
}

export const useFundingSubmissionLineJsonsStore = defineStore("fundingSubmissionLineJsons", () => {
  const items: Ref<FundingSubmissionLineJsonAsIndex[]> = ref([])
  // TODO: Implement total_count here and in the back-end
  const isLoading = ref(false)
  const isErrored = ref(false)
  const isInitialized = ref(false)

  async function initialize(
    params: {
      where?: FundingSubmissionLineJsonWhereOptions
      filters?: FundingSubmissionLineJsonFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<FundingSubmissionLineJsonAsIndex[]> {
    if (isInitialized.value) return items.value

    return fetch(params)
  }

  async function fetch(
    params: {
      where?: FundingSubmissionLineJsonWhereOptions
      filters?: FundingSubmissionLineJsonFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<FundingSubmissionLineJsonAsIndex[]> {
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

    if (isNil(itemForMonth)) return

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
