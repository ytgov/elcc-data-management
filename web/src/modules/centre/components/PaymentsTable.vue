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
      <tr v-if="payments.length === 0">
        <td
          colspan="3"
          class="text-center"
        >
          No payments found
        </td>
      </tr>
      <tr v-if="!isEmpty(newPayment)">
        <td>
          <v-text-field
            v-model="newPayment.title"
            label="Payment Name"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="newPayment.amountInCents"
            label="Payment Amount"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="newPayment.paidAt"
            label="Paid At"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
      </tr>
    </tbody>
  </v-table>

  <div class="mt-4 mr-4 d-flex justify-end">
    <v-btn
      color="primary"
      @click="addRow"
      >Add row</v-btn
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { isEmpty } from "lodash"

import paymentsApi from "@/api/payments-api"

const payments = ref([])
const newPayment = ref({})

onMounted(async () => {
  await paymentsApi.list().then(({ payments: newPayments }) => {
    payments.value = newPayments
  })
})

function addRow() {
  newPayment.value.id = -1
}
</script>
