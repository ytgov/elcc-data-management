import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import centresApi, { type CentreAsShow, type CentrePolicy, CentreStatuses } from "@/api/centres-api"

export { type CentreAsShow, CentreStatuses }

export function useCentre(centreId: Ref<number | null | undefined>) {
  const state = reactive<{
    centre: CentreAsShow | null
    policy: CentrePolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    centre: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<CentreAsShow> {
    const staticCentreId = unref(centreId)

    if (isNil(staticCentreId)) {
      throw new Error("centreId is required")
    }

    state.isLoading = true
    try {
      const { centre, policy } = await centresApi.get(staticCentreId)
      state.isErrored = false
      state.centre = centre
      state.policy = policy

      return centre
    } catch (error) {
      console.error(`Failed to fetch centre: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<CentreAsShow> {
    const staticCentreId = unref(centreId)

    if (isNil(staticCentreId)) {
      throw new Error("centreId is required")
    }

    if (isNil(state.centre)) {
      throw new Error("centre is required")
    }

    state.isLoading = true
    try {
      const { centre, policy } = await centresApi.update(staticCentreId, state.centre)
      state.isErrored = false
      state.centre = centre
      state.policy = policy

      return centre
    } catch (error) {
      console.error(`Failed to save centre: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(centreId),
    async (newCentreId) => {
      if (isNil(newCentreId)) return

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

export default useCentre
