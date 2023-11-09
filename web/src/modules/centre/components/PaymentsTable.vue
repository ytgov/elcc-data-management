<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Payment Name</th>
        <th class="text-left">Payment Amount</th>
        <th class="text-left">Payment Date</th>
        <th class="text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(payment, index) in allPayments"
        :key="index"
      >
        <td>
          <v-text-field
            v-model="payment.name"
            label="Payment Name"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="payment.amountInCents"
            label="Payment Amount"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="payment.paidOn"
            label="Paid At"
            density="compact"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <v-btn
            color="success"
            @click="save(payment)"
            >Save</v-btn
          >
        </td>
      </tr>
      <tr v-if="isEmpty(allPayments)">
        <td
          colspan="3"
          class="text-center"
        >
          No payments found
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
import { computed, ref, onMounted, type Ref } from "vue"
import { isEmpty, isNil } from "lodash"

import paymentsApi, { Payment } from "@/api/payments-api"

type EditablePayment = Payment & { edited: boolean }
type NonPersistedPayment = Pick<Payment, "name" | "amountInCents" | "paidOn">

const persistedPayments: Ref<EditablePayment[]> = ref([])
const nonPersistedPayments: Ref<NonPersistedPayment[]> = ref([])

const allPayments = computed(() => [...persistedPayments.value, ...nonPersistedPayments.value])
const editedPayments = computed(() => persistedPayments.value.filter((p) => p.edited))

onMounted(async () => {
  await fetchPayments()
})

function fetchPayments() {
  return paymentsApi.list().then(({ payments: newPayments }) => {
    persistedPayments.value = newPayments
  })
}

function addRow() {
  nonPersistedPayments.value.push({
    name: "",
    amountInCents: 0,
    paidOn: "",
  })
}

async function save(payment: EditablePayment | NonPersistedPayment) {
  if (isNonPersistedPayment(payment)) {
    return paymentsApi.create(payment).then((newPayment) => {
      nonPersistedPayments.value = nonPersistedPayments.value.filter((p) => p !== payment)
      persistedPayments.value.push(newPayment)
    })
  } else if (isEditedPayment(payment)) {
    return paymentsApi.update(payment.id, payment).then((updatedPayment) => {
      updatedPayment.edited = false
    })
  } else {
    throw new Error("Invalid payment")
  }
}

function isNonPersistedPayment(
  payment: EditablePayment | NonPersistedPayment
): payment is NonPersistedPayment {
  return !("id" in payment)
}

function isEditedPayment(
  payment: EditablePayment | NonPersistedPayment
): payment is EditablePayment {
  return "id" in payment && !isNil(payment.id) && payment.edited === true
}
</script>
