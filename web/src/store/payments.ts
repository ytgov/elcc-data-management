import { defineStore } from "pinia"
import { ref, type Ref } from "vue"

import paymentsApi, {
  isPersistedPayment,
  type Payment,
  type NonPersistedPayment,
  type Params,
} from "@/api/payments-api"

import { useNotificationStore } from "@/store/NotificationStore"

export { isPersistedPayment, type Payment, type NonPersistedPayment, type Params }

export const usePaymentsStore = defineStore("payments", () => {
  const items: Ref<Payment[]> = ref([])
  // TODO: Implement total_count here and in the back-end
  const isLoading = ref(false)
  const isErrored = ref(false)
  const isInitialized = ref(false)

  const notificationStore = useNotificationStore()

  async function initialize(params: Params = {}): Promise<Payment[]> {
    if (isInitialized.value) return items.value

    return fetch(params)
  }

  async function fetch(params: Params = {}): Promise<Payment[]> {
    isLoading.value = true
    try {
      const { payments } = await paymentsApi.list(params)
      isErrored.value = false
      items.value = payments
      isInitialized.value = true
      return payments
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function save(payment: NonPersistedPayment): Promise<Payment> {
    isLoading.value = true
    try {
      const { payment: newPayment } = await paymentsApi.create(payment)
      isErrored.value = false
      items.value.push(newPayment)
      notificationStore.notify({
        text: "Payment saved",
        icon: "mdi-success",
        variant: "success",
      })
      return newPayment
    } catch (error) {
      console.error("Failed to save payment:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function update(paymentId: number, attributes: Partial<Payment>) {
    isLoading.value = true
    try {
      const { payment: updatedPayment } = await paymentsApi.update(paymentId, attributes)
      isErrored.value = false

      replacePayment(paymentId, updatedPayment)

      notificationStore.notify({
        text: "Payment updated",
        icon: "mdi-success",
        variant: "success",
      })
      return updatedPayment
    } catch (error) {
      console.error("Failed to update payment:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function destroy(paymentId: number) {
    isLoading.value = true
    try {
      await paymentsApi.delete(paymentId)
      isErrored.value = false

      deletePayment(paymentId)

      notificationStore.notify({
        text: "Payment deleted",
        icon: "mdi-success",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to delete payment:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Private Methods
  function replacePayment(paymentId: Number, payment: Payment) {
    items.value = items.value.map((payment) => {
      if (payment.id === paymentId) return payment

      return payment
    })
  }

  function deletePayment(paymentId: number) {
    items.value = items.value.filter((payment) => payment.id !== paymentId)
  }

  return {
    items,
    isLoading,
    isErrored,
    isInitialized,
    initialize,
    fetch,
    save,
    update,
    destroy,
  }
})

export default usePaymentsStore
