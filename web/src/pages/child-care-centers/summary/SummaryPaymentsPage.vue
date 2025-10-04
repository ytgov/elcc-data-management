<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left font-weight-bold">Payment Name</th>
        <th class="text-left font-weight-bold">Payment Amount</th>
        <th class="text-left font-weight-bold">Payment Date</th>
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
          :class="index % 2 === 0 ? 'bg-grey-lighten-3' : 'bg-gray-darken-1'"
        >
          <td>
            <v-text-field
              v-model="payment.name"
              aria-label="Payment Name"
              color="primary"
              density="compact"
              variant="underlined"
              hide-details
            ></v-text-field>
          </td>
          <td>
            <CurrencyInput
              :model-value="centsToDollars(payment.amountInCents)"
              aria-label="Payment Amount"
              color="primary"
              density="compact"
              variant="underlined"
              hide-details
              @update:model-value="(newValue: string) => updatePaymentAmount(payment, newValue)"
            />
          </td>
          <td>
            <v-text-field
              v-model="payment.paidOn"
              :rules="[dateRule, containedInFiscalYear]"
              aria-label="Paid On"
              color="primary"
              density="compact"
              hide-details="auto"
              variant="underlined"
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

<script setup lang="ts">
import { computed, ref, type Ref, watch } from "vue"
import { DateTime, Interval } from "luxon"
import { first, isEmpty, isNil, last } from "lodash"
import { storeToRefs } from "pinia"

import DateTimeUtils from "@/utils/date-time-utils"
import useFiscalPeriods from "@/use/use-fiscal-periods"
import {
  usePaymentsStore,
  isPersistedPayment,
  type Payment,
  type NonPersistedPayment,
} from "@/store/payments"

import { dateRule } from "@/utils/validators"
import { centsToDollars, dollarsToCents } from "@/utils/format-money"

import CurrencyInput from "@/components/CurrencyInput.vue"

const props = defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()

const centreIdAsNumber = computed(() => parseInt(props.centreId))
const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const fiscalPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: props.fiscalYearSlug,
  },
}))
const { fiscalPeriods } = useFiscalPeriods(fiscalPeriodsQuery)

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

const fiscalYearInterval = computed(() => {
  const firstFiscalPeriod = first(fiscalPeriods.value)
  const lastFiscalPeriod = last(fiscalPeriods.value)
  const fiscalYearStart = firstFiscalPeriod?.dateStart
  const fiscalYearEnd = lastFiscalPeriod?.dateEnd

  if (isNil(fiscalYearStart) || isNil(fiscalYearEnd)) {
    return
  }

  const fiscalYearStartUTC = DateTimeUtils.fromISO(fiscalYearStart).toUTC()
  const fiscalYearEndUTC = DateTimeUtils.fromISO(fiscalYearEnd).toUTC()
  return Interval.fromDateTimes(fiscalYearStartUTC, fiscalYearEndUTC)
})

watch<[number, string], true>(
  () => [centreIdAsNumber.value, props.fiscalYearSlug],
  ([newCenterId, newFiscalYearSlug], _oldValues) => {
    const newFiscalYear = newFiscalYearSlug.replace("-", "/")
    paymentsStore.fetch({
      where: {
        centreId: newCenterId,
        fiscalYear: newFiscalYear,
      },
    })
  },
  { immediate: true }
)

function containedInFiscalYear(value: string) {
  const date = DateTime.fromFormat(value, "yyyy-MM-dd")

  return fiscalYearInterval.value?.contains(date) || "Date must be within the fiscal year"
}

function updatePaymentAmount(payment: Payment | NonPersistedPayment, newValue: string) {
  if (["-", "", null].includes(newValue)) {
    payment.amountInCents = 0
  } else {
    const newValueNumber = parseFloat(newValue)
    payment.amountInCents = dollarsToCents(newValueNumber)
  }
}

function addRow() {
  const name = paymentNames.value[allPayments.value.length]
  const paidOn = fiscalYear.value.split("/")[0] + "-"
  nonPersistedPayments.value.push({
    centreId: centreIdAsNumber.value,
    fiscalYear: fiscalYear.value,
    name: name,
    amountInCents: 0,
    paidOn,
  })
}

async function savePayment(payment: NonPersistedPayment) {
  await paymentsStore.save(payment)
  deleteNonPersistedPayment(payment)
}

function deleteNonPersistedPayment(payment: NonPersistedPayment) {
  nonPersistedPayments.value = nonPersistedPayments.value.filter((p) => p !== payment)
}

function updatePayment(payment: Payment) {
  return paymentsStore.update(payment.id, payment)
}

function deletePayment(payment: Payment) {
  return paymentsStore.destroy(payment.id)
}
</script>
