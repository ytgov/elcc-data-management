import { isEmpty, isNil } from "lodash"
import { computed, ComputedRef, Ref, toValue } from "vue"

import { type ModelOrder } from "@/api/base-api"
import { type SortItem } from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"

/**
 * Must not conflict with web/src/use/utils/use-vuetify-sort-by-to-safe-route-query.ts SEPARATOR
 */
const SEPARATOR = "."

/**
 * Converts content of the form [
 *  { key: "attribute", order: "asc" },
 *  { key: "attribute", order: "desc" },
 *  { key: "nested.associated.attribute", order: "asc" },
 *  { key: "nested.associated.attribute", order: "desc" },
 * ]
 *
 * to the form [
 *  [ "attribute", "ASC" ],
 *  [ "attribute", "DESC" ],
 *  [ "nested", "associated", "attribute", "ASC" ],
 *  [ "nested", "associated", "attribute", "DESC" ],
 * ]
 */
export function useVuetifySortByToSequelizeSafeOrder(
  sortBy: Ref<SortItem[] | undefined>
): ComputedRef<ModelOrder[] | undefined> {
  const order = computed<ModelOrder[] | undefined>(() => {
    const sortByValue = toValue(sortBy)
    if (isNil(sortByValue) || isEmpty(sortByValue)) {
      return undefined
    }

    return sortByValue.map(({ key: column, order }) => {
      let direction: "ASC" | "DESC" = "ASC"
      if (order === true) {
        direction = "ASC"
      } else if (order === false) {
        direction = "DESC"
      } else if (order === "desc") {
        direction = "DESC"
      } else if (order === "asc") {
        direction = "ASC"
      }

      const nestedAssociatedModelAttributes = column.split(SEPARATOR) as
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]

      return [...nestedAssociatedModelAttributes, direction]
    })
  })

  return order
}

export default useVuetifySortByToSequelizeSafeOrder
