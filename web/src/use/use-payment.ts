import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import paymentsApi, { type PaymentAsShow, type PaymentPolicy } from "@/api/payments-api"

export { type PaymentAsShow, type PaymentPolicy }

export function usePayment(id: Ref<number | null | undefined>) {
  const state = reactive<{
    payment: PaymentAsShow | null
    policy: PaymentPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    payment: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<PaymentAsShow> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { payment, policy } = await paymentsApi.get(staticId)
      state.isErrored = false
      state.payment = payment
      state.policy = policy
      return payment
    } catch (error) {
      console.error(`Failed to fetch payment: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default usePayment
