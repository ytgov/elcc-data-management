import { computed, reactive, toRefs } from "vue"
import { DateTime } from "luxon"

import currentUserApi, { UserRoles, type UserAsShow } from "@/api/current-user-api"

export { UserRoles, type UserAsShow }

// TODO: consider sending this with every api request?
export const CURRENT_USERS_TIMEZONE = DateTime.local().zoneName

// Global state
const state = reactive<{
  currentUser: UserAsShow | null
  isLoading: boolean
  isErrored: boolean
  isCached: boolean
}>({
  currentUser: null,
  isLoading: false,
  isErrored: false,
  isCached: false,
})

type State = typeof state
type LoadedState = Omit<State, "currentUser"> & {
  currentUser: Exclude<State["currentUser"], null>
}

export function useCurrentUser<IsLoaded extends boolean = false>() {
  type StateOrLoadedState = IsLoaded extends true ? LoadedState : State

  const isReady = computed(() => state.isCached && !state.isLoading && !state.isErrored)

  const isSystemAdmin = computed(() =>
    state.currentUser?.roles?.includes(UserRoles.SYSTEM_ADMINISTRATOR)
  )
  const isAdmin = computed(() => isSystemAdmin.value)

  async function fetch(): Promise<UserAsShow> {
    state.isLoading = true
    try {
      const { user } = await currentUserApi.get()
      state.isErrored = false
      state.currentUser = user
      state.isCached = true
      return user
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // Needs to be called during logout or current user will persist.
  function reset() {
    state.currentUser = null
    state.isLoading = false
    state.isErrored = false
    state.isCached = false
  }

  return {
    ...toRefs(state as StateOrLoadedState),
    isReady,
    fetch,
    refresh: fetch,
    reset,
    // helpers
    isAdmin,
    isSystemAdmin,
  }
}

export default useCurrentUser
