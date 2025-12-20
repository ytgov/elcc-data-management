import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import employeeWageTiersApi, { type EmployeeWageTierAsShow } from "@/api/employee-wage-tiers-api"

export { type EmployeeWageTier, type EmployeeWageTierAsShow } from "@/api/employee-wage-tiers-api"

export function useEmployeeWageTier(employeeWageTierId: Ref<number | null | undefined>) {
  const state = reactive<{
    employeeWageTier: EmployeeWageTierAsShow | null
    isLoading: boolean
    isErrored: boolean
  }>({
    employeeWageTier: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<EmployeeWageTierAsShow> {
    const staticEmployeeWageTierId = unref(employeeWageTierId)
    if (isNil(staticEmployeeWageTierId)) {
      throw new Error("employeeWageTierId is required")
    }

    state.isLoading = true
    try {
      const { employeeWageTier } = await employeeWageTiersApi.get(staticEmployeeWageTierId)
      state.employeeWageTier = employeeWageTier
      state.isErrored = false
      return employeeWageTier
    } catch (error) {
      console.error(`Failed to fetch employee wage tier: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(employeeWageTierId),
    async (newEmployeeWageTierId) => {
      if (isNil(newEmployeeWageTierId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useEmployeeWageTier
