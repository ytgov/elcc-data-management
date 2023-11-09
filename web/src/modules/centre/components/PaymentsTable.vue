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
            :rules="[dateRule]"
            label="Paid On"
            density="compact"
            hide-details="auto"
          ></v-text-field>
        </td>
        <td>
          <template v-if="isPersistedPayment(payment)">
            <v-btn
              v-if="payment.edited"
              color="success"
              @click="updatePayment(payment)"
            >
              Edit
            </v-btn>
            <v-btn
              color="error"
              @click="deletePayment(payment)"
            >
              Delete
            </v-btn>
          </template>
          <v-btn
            v-else
            color="success"
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
import paymentsApi, { Payment } from "@/api/payments-api"

import { dateRule } from "@/utils/validators"

type PersistedPayment = Payment & { edited?: boolean }
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

const persistedPayments: Ref<PersistedPayment[]> = ref([])
const nonPersistedPayments: Ref<NonPersistedPayment[]> = ref([])

const allPayments: Ref<(PersistedPayment | NonPersistedPayment)[]> = computed(() => [
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
  return paymentsApi.create(payment).then(({ payment: newPayment }) => {
    nonPersistedPayments.value = nonPersistedPayments.value.filter((p) => p !== payment)
    persistedPayments.value.push(newPayment)
  })
}

function updatePayment(payment: PersistedPayment) {
  return paymentsApi.update(payment.id, payment).then(({ payment: updatedPayment }) => {
    Object.assign(payment, updatedPayment)
    payment.edited = false
  })
}

function deletePayment(payment: PersistedPayment) {
  return paymentsApi.delete(payment.id).then(() => {
    persistedPayments.value = persistedPayments.value.filter((p) => p !== payment)
  })
}

function isPersistedPayment(
  payment: PersistedPayment | NonPersistedPayment
): payment is PersistedPayment {
  return !isNil(payment) && typeof payment === "object" && "id" in payment && !isNil(payment.id)
}
</script>
