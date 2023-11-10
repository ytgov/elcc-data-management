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
      <tr v-if="isLoading">
        <td
          colspan="4"
          class="text-center py-12"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
          ></v-progress-circular>
        </td>
      </tr>
      <template v-else>
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
            <CurrencyInput
              :model-value="centsToDollars(payment.amountInCents)"
              label="Payment Amount"
              density="compact"
              hide-details
              @update:model-value="(newValue: string) => updatePaymentAmount(payment, newValue)"
            />
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
            colspan="4"
            class="text-center"
          >
            No payments found
          </td>
        </tr>
      </template>
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
import { isEmpty } from "lodash"
import { storeToRefs } from "pinia"

import {
  usePaymentsStore,
  isPersistedPayment,
  type Payment,
  type NonPersistedPayment,
} from "@/store/payments"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

import { dateRule } from "@/utils/validators"

import CurrencyInput from "@/components/CurrencyInput.vue"

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
const paymentsStore = usePaymentsStore()

const { isLoading } = storeToRefs(paymentsStore)
const persistedPayments = computed(() => paymentsStore.items)
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
  await paymentsStore.initialize({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })
})

function centsToDollars(value: number) {
  return value / 100
}

function updatePaymentAmount(payment: Payment | NonPersistedPayment, newValue: string) {
  if (["-", "", null].includes(newValue)) {
    payment.amountInCents = 0
  } else {
    const newValueNumber = parseFloat(newValue)
    payment.amountInCents = newValueNumber * 100
  }
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
  return paymentsStore.save(payment).then(() => {
    nonPersistedPayments.value = nonPersistedPayments.value.filter((p) => p !== payment)
  })
}

function updatePayment(payment: Payment) {
  return paymentsStore.update(payment.id, payment)
}

function deletePayment(payment: Payment) {
  return paymentsStore.destroy(payment.id)
}
</script>
