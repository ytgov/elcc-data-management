import { reactive, ref, toRefs, unref, watch } from "vue"
import type { Ref } from "vue"

import employeeWageTiersApi, {
  type EmployeeWageTierAsIndex,
  type EmployeeWageTierQueryOptions,
} from "@/api/employee-wage-tiers-api"

export {
  type EmployeeWageTier,
  type EmployeeWageTierAsIndex,
  type EmployeeWageTierQueryOptions,
  type EmployeeWageTierWhereOptions,
  type EmployeeWageTierFiltersOptions,
} from "@/api/employee-wage-tiers-api"

export function useEmployeeWageTiers(
  queryOptions: Ref<EmployeeWageTierQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    employeeWageTiers: EmployeeWageTierAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    employeeWageTiers: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<EmployeeWageTierAsIndex[]> {
    state.isLoading = true
    try {
      const { employeeWageTiers, totalCount } = await employeeWageTiersApi.list(unref(queryOptions))
      state.isErrored = false
      state.employeeWageTiers = employeeWageTiers
      state.totalCount = totalCount
      return employeeWageTiers
    } catch (error) {
      console.error(`Failed to fetch employee wage tiers: ${error}`, { error })
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

export default useEmployeeWageTiers
