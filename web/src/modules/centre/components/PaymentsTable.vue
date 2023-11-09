<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Payment Name</th>
        <th class="text-left">Payment Amount</th>
        <th class="text-left">Payment Date</th>
        <th></th>
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
            :model-value="formatDollars(payment.amountInCents)"
            label="Payment Amount"
            density="compact"
            prepend-inner-icon="mdi-currency-usd"
            hide-details
            @update:model-value="(newValue: string) => updatePaymentAmount(payment, newValue)"
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="payment.paidOn"
            :rules="[dateRule]"
            label="Paid On"
            density="compact"
            hide-details="auto"
          ></v-text-field>
        </td>
        <td class="text-center">
          <template v-if="isPersistedPayment(payment)">
            <v-btn
              color="success"
              size="small"
              @click="updatePayment(payment)"
            >
              Update
            </v-btn>
            <v-btn
              class="ml-2"
              color="error"
              size="small"
              @click="deletePayment(payment)"
            >
              Delete
            </v-btn>
          </template>
          <v-btn
            v-else
            color="success"
            size="small"
            @click="savePayment(payment)"
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

import { useSubmissionLinesStore } from "@/modules/submission-lines/store"
import { useNotificationStore } from "@/store/NotificationStore"
import paymentsApi, { Payment } from "@/api/payments-api"

import { dateRule } from "@/utils/validators"

type NonPersistedPayment = Omit<Payment, "id" | "createdAt" | "updatedAt">

const props = defineProps({
  centreId: {
    type: String,
    required: true,
  },
  // fiscalYear: { // TODO: support fical year as prop
  //   type: String,
  //   required: true,
  // },
})

const centreIdNumber = computed(() => parseInt(props.centreId))
const submissionLinesStore = useSubmissionLinesStore()
const fiscalYear = computed(() => submissionLinesStore.currentFiscalYear)
const notificationStore = useNotificationStore()

const persistedPayments: Ref<Payment[]> = ref([])
const nonPersistedPayments: Ref<NonPersistedPayment[]> = ref([])

const allPayments: Ref<(Payment | NonPersistedPayment)[]> = computed(() => [
  ...persistedPayments.value,
  ...nonPersistedPayments.value,
])

const paymentNames = ref([
  "First Advance",
  "Second Advance",
  "Third Advance",
  "Fourth Advance",
  "Fifth Advance",
  "Sixth Advance",
  "Reconciliation",
])

onMounted(async () => {
  await submissionLinesStore.initialize() // TODO: push this to a higher plane
  await fetchPayments()
})

function formatDollars(value: number) {
  return value / 100
}
function updatePaymentAmount(payment: Payment | NonPersistedPayment, newValue: string) {
  if (newValue === "-") {
    payment.amountInCents = 0
  } else if (newValue === "") {
    payment.amountInCents = 0
  } else {
    const newValueNumber = parseFloat(newValue)
    payment.amountInCents = Math.trunc(newValueNumber * 100)
  }
}

function fetchPayments() {
  return paymentsApi
    .list({ where: { centreId: centreIdNumber.value, fiscalYear: fiscalYear.value } })
    .then(({ payments: newPayments }) => {
      persistedPayments.value = newPayments
    })
}

function addRow() {
  const name = paymentNames.value[allPayments.value.length]
  const paidOn = fiscalYear.value.split("/")[0] + "-"
  nonPersistedPayments.value.push({
    centreId: centreIdNumber.value,
    fiscalYear: fiscalYear.value,
    name: name,
    amountInCents: 0,
    paidOn,
  })
}

function savePayment(payment: NonPersistedPayment) {
  return paymentsApi
    .create(payment)
    .then(({ payment: newPayment }) => {
      nonPersistedPayments.value = nonPersistedPayments.value.filter((p) => p !== payment)
      persistedPayments.value.push(newPayment)
    })
    .then(() => {
      notificationStore.notify({
        text: "Payment saved",
        icon: "mdi-success",
        variant: "success",
      })
    })
}

function updatePayment(payment: Payment) {
  return paymentsApi
    .update(payment.id, payment)
    .then(({ payment: updatedPayment }) => {
      Object.assign(payment, updatedPayment)
    })
    .then(() => {
      notificationStore.notify({
        text: "Payment updated",
        icon: "mdi-success",
        variant: "success",
      })
    })
}

function deletePayment(payment: Payment) {
  return paymentsApi
    .delete(payment.id)
    .then(() => {
      persistedPayments.value = persistedPayments.value.filter((p) => p !== payment)
    })
    .then(() => {
      notificationStore.notify({
        text: "Payment deleted",
        icon: "mdi-success",
        variant: "success",
      })
    })
}

function isPersistedPayment(payment: Payment | NonPersistedPayment): payment is Payment {
  return !isNil(payment) && typeof payment === "object" && "id" in payment && !isNil(payment.id)
}
</script>
