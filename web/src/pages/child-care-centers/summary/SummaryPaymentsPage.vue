<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left font-weight-bold">Payment Name</th>
        <th class="text-left font-weight-bold">Payment Amount</th>
        <th class="text-left font-weight-bold">Payment Date</th>
        <th class="text-center font-weight-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isLoading && isEmpty(payments)">
        <td
          colspan="4"
          class="text-center"
        >
          <v-skeleton-loader type="table-row@6" />
        </td>
      </tr>
      <tr
        v-for="(payment, index) in payments"
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
            :model-value="payment.amount"
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
            :rules="[isDate(), containedInFiscalYear]"
            aria-label="Paid On"
            color="primary"
            density="compact"
            hide-details="auto"
            variant="underlined"
          ></v-text-field>
        </td>
        <td class="text-center">
          <v-btn
            color="success"
            size="small"
            :loading="isLoadingPaymentMap.get(payment.id)"
            @click="savePayment(payment)"
          >
            Update
          </v-btn>
          <v-btn
            class="ml-2"
            color="error"
            size="small"
            :loading="isLoadingPaymentMap.get(payment.id)"
            @click="deletePayment(payment)"
          >
            Delete
          </v-btn>
        </td>
      </tr>
      <tr
        v-for="(paymentAttributes, index) in paymentsAttributes"
        :key="index"
        :class="index % 2 === 0 ? 'bg-grey-lighten-3' : 'bg-gray-darken-1'"
      >
        <td>
          <v-text-field
            v-model="paymentAttributes.name"
            aria-label="Payment Name"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
          ></v-text-field>
        </td>
        <td>
          <CurrencyInput
            :model-value="paymentAttributes.amount"
            aria-label="Payment Amount"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="
              (newValue: string) => updatePaymentAmount(paymentAttributes, newValue)
            "
          />
        </td>
        <td>
          <v-text-field
            v-model="paymentAttributes.paidOn"
            :rules="[isDate(), containedInFiscalYear]"
            aria-label="Paid On"
            color="primary"
            density="compact"
            hide-details="auto"
            variant="underlined"
          ></v-text-field>
        </td>
        <td class="text-center">
          <v-btn
            color="success"
            size="small"
            :loading="isLoadingPaymentsAttributesMap.get(index)"
            @click="createPayment(paymentAttributes, index)"
            >Save</v-btn
          >
        </td>
      </tr>
      <tr v-if="isEmpty(payments)">
        <td
          colspan="4"
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

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { DateTime, Interval } from "luxon"
import { first, isEmpty, isNil, last } from "lodash"

import DateTimeUtils from "@/utils/date-time-utils"
import { isDate } from "@/utils/validators"

import { MAX_PER_PAGE } from "@/api/base-api"
import paymentsApi, { type Payment } from "@/api/payments-api"
import useFiscalPeriods from "@/use/use-fiscal-periods"
import usePayments from "@/use/use-payments"

import CurrencyInput from "@/components/CurrencyInput.vue"

const props = defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()

const centreIdAsNumber = computed(() => parseInt(props.centreId))
const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))

const paymentsQuery = computed(() => ({
  where: {
    centreId: centreIdAsNumber.value,
    fiscalYear: fiscalYear.value,
  },
  // TODO: Remove this when the payments display is using pagination.
  perPage: MAX_PER_PAGE,
}))
const { payments, isLoading, refresh: refreshPayments } = usePayments(paymentsQuery)

const fiscalPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: props.fiscalYearSlug,
  },
  perPage: MAX_PER_PAGE,
}))
const { fiscalPeriods } = useFiscalPeriods(fiscalPeriodsQuery)

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

function containedInFiscalYear(value: string) {
  const date = DateTime.fromFormat(value, "yyyy-MM-dd")

  return fiscalYearInterval.value?.contains(date) || "Date must be within the fiscal year"
}

function updatePaymentAmount(payment: Payment | Partial<Payment>, newValue: string) {
  if (["-", "", null].includes(newValue)) {
    payment.amount = 0
  } else {
    payment.amount = parseFloat(newValue)
  }
}

const isLoadingPaymentMap = ref(new Map<number, boolean>())

watchEffect(() => {
  isLoadingPaymentMap.value = payments.value.reduce((map, payment) => {
    map.set(payment.id, false)
    return map
  }, new Map<number, boolean>())
})

async function savePayment(payment: Payment) {
  isLoadingPaymentMap.value.set(payment.id, true)
  try {
    const { payment: updatedPayment } = await paymentsApi.update(payment.id, payment)
    const paymentIndex = payments.value.findIndex((payment) => payment.id === updatedPayment.id)
    if (paymentIndex === -1) {
      console.error(`Payment with id ${payment.id} not found in local array`)
      return
    }

    payments.value.splice(paymentIndex, 1, updatedPayment)
  } catch (error) {
    console.error(`Failed to save payment: ${error}`, { error })
    throw error
  } finally {
    isLoadingPaymentMap.value.set(payment.id, false)
  }
}

async function deletePayment(payment: Payment) {
  isLoadingPaymentMap.value.set(payment.id, true)
  try {
    await paymentsApi.delete(payment.id)
    await refreshPayments()
  } catch (error) {
    console.error(`Failed to delete payment: ${error}`, { error })
    throw error
  } finally {
    isLoadingPaymentMap.value.set(payment.id, false)
  }
}

const paymentsAttributes = ref<Partial<Payment>[]>([])

function addRow() {
  const index = payments.value.length + paymentsAttributes.value.length
  const name = paymentNames.value[index]
  const paidOn = fiscalYear.value.split("/")[0] + "-"
  paymentsAttributes.value.push({
    centreId: centreIdAsNumber.value,
    fiscalYear: fiscalYear.value,
    name: name,
    amount: 0,
    paidOn,
  })
}

const isLoadingPaymentsAttributesMap = ref(new Map<number, boolean>())

watchEffect(() => {
  isLoadingPaymentsAttributesMap.value = paymentsAttributes.value.reduce((map, _payment, index) => {
    map.set(index, false)
    return map
  }, new Map<number, boolean>())
})

async function createPayment(payment: Partial<Payment>, index: number) {
  isLoadingPaymentsAttributesMap.value.set(index, true)
  try {
    await paymentsApi.create(payment)
    await refreshPayments()
    paymentsAttributes.value.splice(index, 1)
  } catch (error) {
    console.error(`Failed to create payment: ${error}`, { error })
    throw error
  } finally {
    isLoadingPaymentsAttributesMap.value.set(index, false)
  }
}
</script>
