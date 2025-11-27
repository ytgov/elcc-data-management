import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingReconciliationsApi, {
  type FundingReconciliationAsShow,
  type FundingReconciliationPolicy,
} from "@/api/funding-reconciliations-api"

export { type FundingReconciliationAsShow }

export function useFundingReconciliation(fundingReconciliationId: Ref<number | null | undefined>) {
  const state = reactive<{
    fundingReconciliation: FundingReconciliationAsShow | null
    policy: FundingReconciliationPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingReconciliation: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingReconciliationAsShow> {
    const staticFundingReconciliationId = unref(fundingReconciliationId)
    if (isNil(staticFundingReconciliationId)) {
      throw new Error("fundingReconciliationId is required")
    }

    state.isLoading = true
    try {
      const { fundingReconciliation, policy } = await fundingReconciliationsApi.get(
        staticFundingReconciliationId
      )
      state.isErrored = false
      state.fundingReconciliation = fundingReconciliation
      state.policy = policy
      return fundingReconciliation
    } catch (error) {
      console.error(`Failed to fetch funding reconciliation: ${error}`, error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<FundingReconciliationAsShow> {
    const staticFundingReconciliationId = unref(fundingReconciliationId)
    if (isNil(staticFundingReconciliationId)) {
      throw new Error("fundingReconciliationId is required")
    }

    if (isNil(state.fundingReconciliation)) {
      throw new Error("Funding reconciliation is required")
    }

    state.isLoading = true
    try {
      const { fundingReconciliation, policy } = await fundingReconciliationsApi.update(
        staticFundingReconciliationId,
        state.fundingReconciliation
      )
      state.isErrored = false
      state.fundingReconciliation = fundingReconciliation
      state.policy = policy
      return fundingReconciliation
    } catch (error) {
      console.error(`Failed to save funding reconciliation: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(fundingReconciliationId),
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

export default useFundingReconciliation
