import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import fundingRegionsApi, {
  type FundingRegionAsShow,
  type FundingRegionPolicy,
} from "@/api/funding-regions-api"

export { type FundingRegionAsShow }

export function useFundingRegion(fundingRegionId: Ref<number | null | undefined>) {
  const state = reactive<{
    fundingRegion: FundingRegionAsShow | null
    policy: FundingRegionPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    fundingRegion: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<FundingRegionAsShow> {
    const staticFundingRegionId = unref(fundingRegionId)

    if (isNil(staticFundingRegionId)) {
      throw new Error("fundingRegionId is required")
    }

    state.isLoading = true
    try {
      const { fundingRegion, policy } = await fundingRegionsApi.get(staticFundingRegionId)
      state.isErrored = false
      state.fundingRegion = fundingRegion
      state.policy = policy

      return fundingRegion
    } catch (error) {
      console.error(`Failed to fetch funding region: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<FundingRegionAsShow> {
    const staticFundingRegionId = unref(fundingRegionId)

    if (isNil(staticFundingRegionId)) {
      throw new Error("fundingRegionId is required")
    }

    if (isNil(state.fundingRegion)) {
      throw new Error("fundingRegion is required")
    }

    state.isLoading = true
    try {
      const { fundingRegion, policy } = await fundingRegionsApi.update(
        staticFundingRegionId,
        state.fundingRegion
      )
      state.isErrored = false
      state.fundingRegion = fundingRegion
      state.policy = policy

      return fundingRegion
    } catch (error) {
      console.error(`Failed to save funding region: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(fundingRegionId),
    async (newFundingRegionId) => {
      if (isNil(newFundingRegionId)) return

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

export default useFundingRegion
