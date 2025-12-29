import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import { initializeApi, type InitializationStatus } from "@/api/centres/funding-periods"

export { type InitializationStatus }

export function useCentreFundingPeriodInitialization(
  centreId: Ref<number | null | undefined>,
  fundingPeriodId: Ref<number | null | undefined>
) {
  const state = reactive<{
    initializationStatus: InitializationStatus | null
    isLoading: boolean
    isErrored: boolean
    isInitializing: boolean
  }>({
    initializationStatus: null,
    isLoading: false,
    isErrored: false,
    isInitializing: false,
  })

  async function fetch(): Promise<InitializationStatus> {
    const staticCentreId = unref(centreId)
    const staticFundingPeriodId = unref(fundingPeriodId)

    if (isNil(staticCentreId)) {
      throw new Error("centreId is required")
    }

    if (isNil(staticFundingPeriodId)) {
      throw new Error("fundingPeriodId is required")
    }

    state.isLoading = true
    try {
      const { initializationStatus } = await initializeApi.get(
        staticCentreId,
        staticFundingPeriodId
      )
      state.isErrored = false
      state.initializationStatus = initializationStatus
      return initializationStatus
    } catch (error) {
      console.error(`Failed to fetch initialization status: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function initialize(): Promise<InitializationStatus> {
    const staticCentreId = unref(centreId)
    const staticFundingPeriodId = unref(fundingPeriodId)

    if (isNil(staticCentreId)) {
      throw new Error("centreId is required")
    }

    if (isNil(staticFundingPeriodId)) {
      throw new Error("fundingPeriodId is required")
    }

    state.isInitializing = true
    try {
      const { initializationStatus } = await initializeApi.create(
        staticCentreId,
        staticFundingPeriodId
      )
      state.isErrored = false
      state.initializationStatus = initializationStatus
      return initializationStatus
    } catch (error) {
      console.error(`Failed to initialize: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isInitializing = false
    }
  }

  watch(
    () => [unref(centreId), unref(fundingPeriodId)],
    async ([newCentreId, newFundingPeriodId]) => {
      if (isNil(newCentreId) || isNil(newFundingPeriodId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    initialize,
  }
}

export default useCentreFundingPeriodInitialization
