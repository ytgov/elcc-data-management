import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import buildingExpenseCategoriesApi, {
  type BuildingExpenseCategoryAsShow,
  type BuildingExpenseCategoryPolicy,
} from "@/api/building-expense-categories-api"

export { type BuildingExpenseCategoryAsShow }

export function useBuildingExpenseCategory(
  buildingExpenseCategoryId: Ref<number | null | undefined>
) {
  const state = reactive<{
    buildingExpenseCategory: BuildingExpenseCategoryAsShow | null
    policy: BuildingExpenseCategoryPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    buildingExpenseCategory: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<BuildingExpenseCategoryAsShow> {
    const staticBuildingExpenseCategoryId = unref(buildingExpenseCategoryId)

    if (isNil(staticBuildingExpenseCategoryId)) {
      throw new Error("buildingExpenseCategoryId is required")
    }

    state.isLoading = true
    try {
      const { buildingExpenseCategory, policy } = await buildingExpenseCategoriesApi.get(
        staticBuildingExpenseCategoryId
      )
      state.isErrored = false
      state.buildingExpenseCategory = buildingExpenseCategory
      state.policy = policy
      return buildingExpenseCategory
    } catch (error) {
      console.error(`Failed to fetch building expense category: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<BuildingExpenseCategoryAsShow> {
    const staticBuildingExpenseCategoryId = unref(buildingExpenseCategoryId)

    if (isNil(staticBuildingExpenseCategoryId)) {
      throw new Error("buildingExpenseCategoryId is required")
    }

    if (isNil(state.buildingExpenseCategory)) {
      throw new Error("buildingExpenseCategory is required")
    }

    state.isLoading = true
    try {
      const { buildingExpenseCategory, policy } = await buildingExpenseCategoriesApi.update(
        staticBuildingExpenseCategoryId,
        state.buildingExpenseCategory
      )
      state.isErrored = false
      state.buildingExpenseCategory = buildingExpenseCategory
      state.policy = policy
      return buildingExpenseCategory
    } catch (error) {
      console.error(`Failed to save building expense category: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(buildingExpenseCategoryId),
    async (newBuildingExpenseCategoryId) => {
      if (isNil(newBuildingExpenseCategoryId)) return

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

export default useBuildingExpenseCategory
