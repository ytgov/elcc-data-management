import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"

import buildingExpenseCategoriesApi, {
  type BuildingExpenseCategoryAsIndex,
  type BuildingExpenseCategoryFiltersOptions,
  type BuildingExpenseCategoryQueryOptions,
  type BuildingExpenseCategoryWhereOptions,
} from "@/api/building-expense-categories-api"

export {
  type BuildingExpenseCategoryAsIndex,
  type BuildingExpenseCategoryFiltersOptions,
  type BuildingExpenseCategoryQueryOptions,
  type BuildingExpenseCategoryWhereOptions,
}

export function useBuildingExpenseCategories(
  queryOptions: Ref<BuildingExpenseCategoryQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    buildingExpenseCategories: BuildingExpenseCategoryAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    buildingExpenseCategories: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<BuildingExpenseCategoryAsIndex[]> {
    state.isLoading = true
    try {
      const { buildingExpenseCategories, totalCount } = await buildingExpenseCategoriesApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.buildingExpenseCategories = buildingExpenseCategories
      state.totalCount = totalCount
      return buildingExpenseCategories
    } catch (error) {
      console.error(`Failed to fetch building expense categories: ${error}`, { error })
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

export default useBuildingExpenseCategories
