import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import employeeBenefitsApi, {
  type EmployeeBenefitAsShow,
  type EmployeeBenefitPolicy,
} from "@/api/employee-benefits-api"

export { type EmployeeBenefitAsShow }

export function useEmployeeBenefit(id: Ref<number | null | undefined>) {
  const state = reactive<{
    employeeBenefit: EmployeeBenefitAsShow | null
    policy: EmployeeBenefitPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    employeeBenefit: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<EmployeeBenefitAsShow> {
    const staticId = unref(id)

    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { employeeBenefit, policy } = await employeeBenefitsApi.get(staticId)
      state.isErrored = false
      state.employeeBenefit = employeeBenefit
      state.policy = policy
      return employeeBenefit
    } catch (error) {
      console.error("Failed to fetch employee benefit:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<EmployeeBenefitAsShow> {
    if (isNil(state.employeeBenefit)) {
      throw new Error("Employee benefit is required")
    }

    if (isNil(state.employeeBenefit.id)) {
      throw new Error(
        "Employee benefit must have an id. Records should be created during fiscal year initialization."
      )
    }

    state.isLoading = true
    try {
      const { employeeBenefit, policy } = await employeeBenefitsApi.update(
        state.employeeBenefit.id,
        state.employeeBenefit
      )

      state.isErrored = false
      state.employeeBenefit = employeeBenefit
      state.policy = policy
      return employeeBenefit
    } catch (error) {
      console.error(`Failed to save employee benefit: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

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

export default useEmployeeBenefit
