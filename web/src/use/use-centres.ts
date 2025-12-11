import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import centresApi, {
  type CentreAsIndex,
  type CentreFiltersOptions,
  type CentreQueryOptions,
  type CentreWhereOptions,
} from "@/api/centres-api"

export {
  type CentreAsIndex,
  type CentreFiltersOptions,
  type CentreQueryOptions,
  type CentreWhereOptions,
}

export function useCentres(
  queryOptions: Ref<CentreQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    centres: CentreAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    centres: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<CentreAsIndex[]> {
    state.isLoading = true
    try {
      const { centres, totalCount } = await centresApi.list(unref(queryOptions))
      state.isErrored = false
      state.centres = centres
      state.totalCount = totalCount
      return centres
    } catch (error) {
      console.error(`Failed to fetch centres: ${error}`, { error })
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

export default useCentres
