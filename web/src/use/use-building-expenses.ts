import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import buildingExpensesApi, {
  type BuildingExpenseAsIndex,
  type BuildingExpenseFiltersOptions,
  type BuildingExpenseQueryOptions,
  type BuildingExpenseWhereOptions,
} from "@/api/building-expenses-api"

export {
  type BuildingExpenseAsIndex,
  type BuildingExpenseFiltersOptions,
  type BuildingExpenseQueryOptions,
  type BuildingExpenseWhereOptions,
}

export function useBuildingExpenses(
  queryOptions: Ref<BuildingExpenseQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    buildingExpenses: BuildingExpenseAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    buildingExpenses: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<BuildingExpenseAsIndex[]> {
    state.isLoading = true
    try {
      const { buildingExpenses, totalCount } = await buildingExpensesApi.list(unref(queryOptions))
      state.isErrored = false
      state.buildingExpenses = buildingExpenses
      state.totalCount = totalCount
      return buildingExpenses
    } catch (error) {
      console.error(`Failed to fetch building expenses: ${error}`, { error })
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

export default useBuildingExpenses
