import { defineStore } from "pinia"
import { reactive, toRefs, watch } from "vue"

import fiscalPeriodsApi, {
  type FiscalPeriodFiltersOptions,
  type FiscalPeriodWhereOptions,
  type FiscalPeriod,
} from "@/api/fiscal-periods-api"

export { type FiscalPeriodFiltersOptions, type FiscalPeriodWhereOptions, type FiscalPeriod }

export const useFiscalPeriodsStore = defineStore("fiscal-periods", () => {
  const state = reactive<{
    fiscalPeriods: FiscalPeriod[]
    isLoading: boolean
    isErrored: boolean
    isInitialized: boolean
  }>({
    fiscalPeriods: [],
    isLoading: false,
    isErrored: false,
    isInitialized: false,
  })

  async function fetch(params: {
    where?: FiscalPeriodWhereOptions
    filters?: FiscalPeriodFiltersOptions
    page?: number
    perPage?: number
  }): Promise<FiscalPeriod[]> {
    state.isLoading = true
    try {
      const { fiscalPeriods } = await fiscalPeriodsApi.list(params)
      state.isErrored = false
      state.fiscalPeriods = fiscalPeriods
      state.isInitialized = true
      return fiscalPeriods
    } catch (error) {
      console.error("Failed to fetch fiscal periods:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  return {
    ...toRefs(state),
    fetch,
  }
})

export default useFiscalPeriodsStore
