import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import usersApi, { UserRoles, type UserAsShow, type UserPolicy } from "@/api/users-api"

export { UserRoles, type UserAsShow, type UserPolicy }

export function useUser(userId: Ref<number | null | undefined>) {
  const state = reactive<{
    user: UserAsShow | null
    policy: UserPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    user: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<UserAsShow> {
    const staticUserId = unref(userId)

    if (isNil(staticUserId)) {
      throw new Error("userId is required")
    }

    state.isLoading = true
    try {
      const { user, policy } = await usersApi.get(staticUserId)
      state.isErrored = false
      state.user = user
      state.policy = policy
      return user
    } catch (error) {
      console.error(`Failed to fetch user: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<UserAsShow> {
    const staticUserId = unref(userId)

    if (isNil(staticUserId)) {
      throw new Error("userId is required")
    }

    if (isNil(state.user)) {
      throw new Error("user is required")
    }

    state.isLoading = true
    try {
      const { user, policy } = await usersApi.update(staticUserId, state.user)
      state.isErrored = false
      state.user = user
      state.policy = policy
      return user
    } catch (error) {
      console.error(`Failed to save user: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(userId),
    async (newUserId) => {
      if (isNil(newUserId)) return

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

export default useUser
