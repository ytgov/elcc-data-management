import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import fiscalPeriodsApi, {
  FiscalPeriodMonths,
  type FiscalPeriod,
  type FiscalPeriodWhereOptions,
  type FiscalPeriodFiltersOptions,
} from "@/api/fiscal-periods-api"

export {
  FiscalPeriodMonths,
  type FiscalPeriod,
  type FiscalPeriodWhereOptions,
  type FiscalPeriodFiltersOptions,
}

export function useFiscalPeriods(
  queryOptions: Ref<{
    where?: FiscalPeriodWhereOptions
    filters?: FiscalPeriodFiltersOptions
    page?: number
    perPage?: number
  }> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    fiscalPeriods: FiscalPeriod[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    fiscalPeriods: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FiscalPeriod[]> {
    state.isLoading = true
    try {
      const { fiscalPeriods, totalCount } = await fiscalPeriodsApi.list(unref(queryOptions))
      state.isErrored = false
      state.fiscalPeriods = fiscalPeriods
      state.totalCount = totalCount
      return fiscalPeriods
    } catch (error) {
      console.error("Failed to fetch fiscal periods:", error)
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

export default useFiscalPeriods
