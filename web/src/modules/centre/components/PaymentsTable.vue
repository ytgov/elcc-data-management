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
import { reactive } from "vue"

const payments: any[] = reactive([])
</script>
