import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import paymentsApi, {
  type PaymentAsIndex,
  type PaymentWhereOptions,
  type PaymentFiltersOptions,
  type PaymentQueryOptions,
} from "@/api/payments-api"

export {
  type PaymentAsIndex,
  type PaymentWhereOptions,
  type PaymentFiltersOptions,
  type PaymentQueryOptions,
}

export function usePayments(
  queryOptions: Ref<PaymentQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    payments: PaymentAsIndex[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    payments: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<PaymentAsIndex[]> {
    state.isLoading = true
    try {
      const { payments, totalCount } = await paymentsApi.list(unref(queryOptions))
      state.isErrored = false
      state.payments = payments
      state.totalCount = totalCount
      return payments
    } catch (error) {
      console.error(`Failed to fetch payments: ${error}`, { error })
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

export default usePayments
