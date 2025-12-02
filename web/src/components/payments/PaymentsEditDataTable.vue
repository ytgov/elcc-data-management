<template>
  <v-data-table
    v-model:page="page"
    :headers="headers"
    :items="payments"
    :loading="isLoading"
    no-data-text="No payments found"
  >
    <template #item.amount="{ item }">
      {{ formatMoney(item.amount) }}
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="primary"
        variant="outlined"
        size="small"
        @click="emit('edit', item.id)"
      >
        Edit
      </v-btn>
      <v-btn
        class="ml-2"
        color="error"
        variant="outlined"
        size="small"
        :loading="isDeletingPaymentId === item.id"
        @click="deletePayment(item)"
      >
        Delete
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { formatMoney } from "@/utils/formatters"

import { MAX_PER_PAGE } from "@/api/base-api"
import useSnack from "@/use/use-snack"
import usePayments, {
  type PaymentWhereOptions,
  type PaymentFiltersOptions,
} from "@/use/use-payments"

import paymentsApi, { type PaymentAsIndex } from "@/api/payments-api"

const props = withDefaults(
  defineProps<{
    where?: PaymentWhereOptions
    filters?: PaymentFiltersOptions
  }>(),
  {
    where: () => ({}),
    filters: () => ({}),
  }
)

const emit = defineEmits<{
  edit: [paymentId: number]
}>()

const headers = [
  {
    title: "Payment Name",
    key: "name",
    sortable: false,
  },
  {
    title: "Payment Amount",
    key: "amount",
    sortable: false,
  },
  {
    title: "Payment Date",
    key: "paidOn",
    sortable: false,
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "center" as const,
  },
]

const page = ref(1)

const paymentsQueryOptions = computed(() => ({
  where: props.where,
  filters: props.filters,
  page: page.value,
  perPage: MAX_PER_PAGE, // TODO: add pagination to table.
}))
const { payments, isLoading, refresh } = usePayments(paymentsQueryOptions)

const isDeletingPaymentId = ref<number | null>(null)
const snack = useSnack()

async function deletePayment(payment: PaymentAsIndex) {
  isDeletingPaymentId.value = payment.id
  try {
    await paymentsApi.delete(payment.id)
    await refresh()
    snack.success("Payment deleted successfully")
  } catch (error) {
    console.error(`Failed to delete payment: ${error}`, { error })
    snack.error("Failed to delete payment")
  } finally {
    isDeletingPaymentId.value = null
  }
}

defineExpose({
  refresh,
})
</script>
