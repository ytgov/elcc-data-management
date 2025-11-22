import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import employeeBenefitsApi, {
  type EmployeeBenefit,
  type EmployeeBenefitWhereOptions,
  type EmployeeBenefitFiltersOptions,
  type EmployeeBenefitQueryOptions,
} from "@/api/employee-benefits-api"

export {
  type EmployeeBenefit,
  type EmployeeBenefitWhereOptions,
  type EmployeeBenefitFiltersOptions,
  type EmployeeBenefitQueryOptions,
}

export function useEmployeeBenefits(
  queryOptions: Ref<EmployeeBenefitQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    employeeBenefits: EmployeeBenefit[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    employeeBenefits: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<EmployeeBenefit[]> {
    state.isLoading = true
    try {
      const { employeeBenefits, totalCount } = await employeeBenefitsApi.list(unref(queryOptions))
      state.isErrored = false
      state.employeeBenefits = employeeBenefits
      state.totalCount = totalCount
      return employeeBenefits
    } catch (error) {
      console.error(`Failed to fetch employee benefits: ${error}`, { error })
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

export default useEmployeeBenefits
