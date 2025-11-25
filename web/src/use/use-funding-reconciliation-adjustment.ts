import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingReconciliationAdjustmentsApi, {
  type FundingReconciliationAdjustmentAsShow,
  type FundingReconciliationAdjustmentPolicy,
} from "@/api/funding-reconciliation-adjustments-api"

export { type FundingReconciliationAdjustmentAsShow }

export function useFundingReconciliationAdjustment(
  fundingReconciliationId: Ref<number | null | undefined>
) {
  const state = reactive<{
    fundingReconciliationAdjustment: FundingReconciliationAdjustmentAsShow | null
    policy: FundingReconciliationAdjustmentPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingReconciliationAdjustment: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingReconciliationAdjustmentAsShow> {
    const staticFundingReconciliationId = unref(fundingReconciliationId)
    if (isNil(staticFundingReconciliationId)) {
      throw new Error("fundingReconciliationId is required")
    }

    state.isLoading = true
    try {
      const { fundingReconciliationAdjustment, policy } =
        await fundingReconciliationAdjustmentsApi.get(staticFundingReconciliationId)
      state.isErrored = false
      state.fundingReconciliationAdjustment = fundingReconciliationAdjustment
      state.policy = policy
      return fundingReconciliationAdjustment
    } catch (error) {
      console.error("Failed to fetch funding reconciliation adjustment:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<FundingReconciliationAdjustmentAsShow> {
    const staticFundingReconciliationId = unref(fundingReconciliationId)
    if (isNil(staticFundingReconciliationId)) {
      throw new Error("fundingReconciliationId is required")
    }

    if (isNil(state.fundingReconciliationAdjustment)) {
      throw new Error("Funding reconciliation adjustment is required")
    }

    state.isLoading = true
    try {
      const { fundingReconciliationAdjustment, policy } =
        await fundingReconciliationAdjustmentsApi.update(
          staticFundingReconciliationId,
          state.fundingReconciliationAdjustment
        )
      state.isErrored = false
      state.fundingReconciliationAdjustment = fundingReconciliationAdjustment
      state.policy = policy
      return fundingReconciliationAdjustment
    } catch (error) {
      console.error(`Failed to save funding reconciliation adjustment: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(fundingReconciliationId),
    async (newFundingReconciliationId) => {
      if (isNil(newFundingReconciliationId)) return

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

export default useFundingReconciliationAdjustment
