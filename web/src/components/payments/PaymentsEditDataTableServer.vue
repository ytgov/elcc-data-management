<template>
  <v-data-table-server
    v-model:page="page"
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="payments"
    :items-length="totalCount"
    :loading="isLoading"
    density="comfortable"
    multi-sort
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
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { formatMoney } from "@/utils/formatters"
import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"

import paymentsApi, { type PaymentAsIndex } from "@/api/payments-api"
import usePayments, {
  type PaymentWhereOptions,
  type PaymentFiltersOptions,
} from "@/use/use-payments"
import useSnack from "@/use/use-snack"

const props = withDefaults(
  defineProps<{
    where?: PaymentWhereOptions
    filters?: PaymentFiltersOptions
    routeQuerySuffix?: string
  }>(),
  {
    where: () => ({}),
    filters: () => ({}),
    routeQuerySuffix: "",
  }
)

const emit = defineEmits<{
  edit: [paymentId: number]
}>()

const headers = [
  {
    title: "Payment Name",
    key: "name",
  },
  {
    title: "Payment Amount",
    key: "amount",
  },
  {
    title: "Payment Date",
    key: "paidOn",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "center" as const,
  },
]

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", { transform: Number })
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", { transform: Number })
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`)

const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const paymentsQueryOptions = computed(() => ({
  where: props.where,
  filters: props.filters,
  order: order.value,
  page: page.value,
  perPage: perPage.value,
}))
const { payments, totalCount, isLoading, refresh } = usePayments(paymentsQueryOptions)

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
