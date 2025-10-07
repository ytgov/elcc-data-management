import { reactive, toRefs, watch, MaybeRefOrGetter, toValue } from "vue"
import { RouteLocationRaw } from "vue-router"
import { cloneDeep, isUndefined } from "lodash"

export type Breadcrumb = {
  title?: string
  disabled?: boolean
  exact?: boolean
  to: RouteLocationRaw
}

// Global state for breadcrumbs
const state = reactive<{
  title?: string
  baseCrumb: Breadcrumb
  breadcrumbs: Breadcrumb[]
}>({
  title: "ELCC Data Management",
  baseCrumb: {
    title: "Home",
    to: {
      name: "DashboardPage",
    },
  },
  breadcrumbs: [],
})

// TODO: Consider supporting config option for setting base crumb?
export function useBreadcrumbs(
  title?: MaybeRefOrGetter<string>,
  breadcrumbs?: MaybeRefOrGetter<Breadcrumb[]>,
  options?: MaybeRefOrGetter<{
    baseCrumb?: Breadcrumb
  }>
) {
  watch(
    () => toValue(title),
    (newTitle) => {
      if (isUndefined(newTitle)) return

      state.title = newTitle
    },
    {
      immediate: true,
    }
  )

  watch(
    () => cloneDeep(toValue(breadcrumbs)),
    (newBreadcrumbs) => {
      if (isUndefined(newBreadcrumbs)) return

      state.breadcrumbs = [state.baseCrumb, ...newBreadcrumbs]
    },
    {
      immediate: true,
      deep: true,
    }
  )

  watch(
    () => cloneDeep(toValue(options)),
    (newOptions) => {
      if (isUndefined(newOptions)) return

      if (!isUndefined(newOptions.baseCrumb)) {
        state.baseCrumb = newOptions.baseCrumb
      }
    },
    {
      immediate: true,
      deep: true,
    }
  )

  return {
    ...toRefs(state),
  }
}

export default useBreadcrumbs
