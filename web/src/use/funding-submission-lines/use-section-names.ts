import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import sectionNamesApi, {
  type SectionNamesFiltersOptions,
  type SectionNamesWhereOptions,
  type SectionNamesQueryOptions,
} from "@/api/funding-submission-lines/section-names-api"

export {
  type SectionNamesWhereOptions,
  type SectionNamesFiltersOptions,
  type SectionNamesQueryOptions,
}

export function useSectionNames(
  queryOptions: Ref<SectionNamesQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    sectionNames: string[]
    isLoading: boolean
    isErrored: boolean
  }>({
    sectionNames: [],
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<string[]> {
    state.isLoading = true
    try {
      const { sectionNames } = await sectionNamesApi.list(unref(queryOptions))
      state.isErrored = false
      state.sectionNames = sectionNames
      return sectionNames
    } catch (error) {
      console.error(`Failed to fetch funding submission line section names: ${error}`, { error })
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

export default useSectionNames
