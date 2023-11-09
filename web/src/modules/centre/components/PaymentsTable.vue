<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Payment Name</th>
        <th class="text-left">Payment Amount</th>
        <th class="text-left">Payment Date</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="payment in payments"
        :key="payment.id"
      >
        <td>{{ payment.title }}</td>
        <td>{{ payment.amountInCents }}</td>
        <td>{{ payment.paidAt }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"

import paymentsApi from "@/api/payments-api"

const payments = ref([])

onMounted(async () => {
  await paymentsApi.list().then(({ payments: newPayments }) => {
    payments.value = newPayments
  })
})
</script>
