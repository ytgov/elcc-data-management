import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import usersApi, {
  type UserAsIndex,
  type UserWhereOptions,
  type UserFiltersOptions,
  type UserQueryOptions,
} from "@/api/users-api"

export { type UserAsIndex, type UserWhereOptions, type UserFiltersOptions, type UserQueryOptions }

export function useUsers(
  queryOptions: Ref<UserQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    users: UserAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    users: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<UserAsIndex[]> {
    state.isLoading = true
    try {
      const { users, totalCount } = await usersApi.list(unref(queryOptions))
      state.isErrored = false
      state.users = users
      state.totalCount = totalCount
      return users
    } catch (error) {
      console.error("Failed to fetch users:", error)
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

export default useUsers
