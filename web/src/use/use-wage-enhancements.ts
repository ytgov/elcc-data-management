import { reactive, ref, toRefs, unref, watch } from "vue"
import type { Ref } from "vue"

import wageEnhancementsApi, {
  type WageEnhancementAsIndex,
  type WageEnhancementQueryOptions,
} from "@/api/wage-enhancements-api"

export {
  EI_CPP_WCB_RATE,
  type WageEnhancement,
  type WageEnhancementAsIndex,
  type WageEnhancementQueryOptions,
  type WageEnhancementWhereOptions,
  type WageEnhancementFiltersOptions,
} from "@/api/wage-enhancements-api"

export function useWageEnhancements(
  queryOptions: Ref<WageEnhancementQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    wageEnhancements: WageEnhancementAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    wageEnhancements: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<WageEnhancementAsIndex[]> {
    state.isLoading = true
    try {
      const { wageEnhancements, totalCount } = await wageEnhancementsApi.list(unref(queryOptions))
      state.wageEnhancements = wageEnhancements
      state.totalCount = totalCount
      state.isErrored = false
      return wageEnhancements
    } catch (error) {
      console.error(`Failed to fetch wage enhancements: ${error}`, { error })
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

export default useWageEnhancements
