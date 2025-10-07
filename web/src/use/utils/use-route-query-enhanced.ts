import { computed, MaybeRefOrGetter, Ref } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { RouteParamValueRaw } from "vue-router"

type RouteQueryValueRaw = RouteParamValueRaw | string[]

/**
 * Enhanced useRouteQuery with parse and stringify transformations
 *
 * See https://github.com/vueuse/vueuse/blob/0f11df11962f5f2e912d66c8544bc6767630780a/packages/router/useRouteQuery/index.ts
 */
export function useRouteQueryEnhanced<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
  name: string,
  defaultValue: MaybeRefOrGetter<T>,
  options: {
    parse: (value: T) => K
    stringify: (value: K) => T
  }
): Ref<K> {
  const query = useRouteQuery<T>(name, defaultValue)

  return computed<K>({
    get() {
      return options.parse(query.value)
    },
    set(value: K) {
      query.value = options.stringify(value)
    },
  })
}

export default useRouteQueryEnhanced
