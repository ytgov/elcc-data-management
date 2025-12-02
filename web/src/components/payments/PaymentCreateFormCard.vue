<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    @submit.prevent="createPayment"
  >
    <template #header>
      <h4>Create Payment</h4>
    </template>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="paymentAttributes.name"
          label="Payment Name"
          :rules="[required]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="paymentAttributes.amount"
          label="Payment Amount"
          :rules="[required, greaterThan(0)]"
          validate-on="blur"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <StringDateInput
          v-model="paymentAttributes.paidOn"
          :loading="isLoadingFundingPeriods"
          label="Paid On"
          :rules="[required, paidOnDateRangeValidator]"
          :min="startOfFundingPeriod"
          :max="endOfFundingPeriod"
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn
        color="primary"
        type="submit"
        :loading="isCreating"
      >
        Create
      </v-btn>
      <v-btn
        variant="text"
        color="warning"
        @click="emit('cancel')"
      >
        Cancel
      </v-btn>
    </template>
  </HeaderActionsFormCard>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from "vue"
import { isNil } from "lodash"

import DateTimeUtils from "@/utils/date-time-utils"
import { normalizeFiscalYearToLongForm } from "@/utils/fiscal-year"
import { dateBetween, greaterThan, required } from "@/utils/validators"

import paymentsApi, { PAYMENT_NAMES, type Payment } from "@/api/payments-api"

import useSnack from "@/use/use-snack"
import useFundingPeriods from "@/use/use-funding-periods"
import usePayments from "@/use/use-payments"

import CurrencyInput from "@/components/CurrencyInput.vue"
import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"
import StringDateInput from "@/components/common/StringDateInput.vue"

const props = defineProps<{
  centreId: number
  fiscalYearLegacy: string
}>()

const emit = defineEmits<{
  created: [paymentId: number]
  cancel: [void]
}>()

const paymentAttributes = ref<Partial<Payment>>({
  centreId: props.centreId,
  fiscalYear: props.fiscalYearLegacy,
  name: "First Advance",
  amount: "0",
  paidOn: undefined,
})


const paymentsQueryOptions = computed(() => ({
  where: {
    centreId: props.centreId,
    fiscalYear: props.fiscalYearLegacy,
  },
  perPage: 1, // we only need the count
}))
const { totalCount: totalCountPayments } = usePayments(paymentsQueryOptions)
const defaultPaymentName = computed(() => {
  const nextPaymentIndex = totalCountPayments.value
  return PAYMENT_NAMES[nextPaymentIndex] ?? `Payment ${nextPaymentIndex + 1}`
})

watchEffect(() => {
  paymentAttributes.value.name = defaultPaymentName.value
})

const fiscalYearLong = computed(() => normalizeFiscalYearToLongForm(props.fiscalYearLegacy))
const fundingPeriodsQueryOptions = computed(() => ({
  where: {
    fiscalYear: fiscalYearLong.value,
  },
  perPage: 1,
}))
const { fundingPeriods, isLoading: isLoadingFundingPeriods } = useFundingPeriods(
  fundingPeriodsQueryOptions
)
const fundingPeriod = computed(() => fundingPeriods.value[0])
const startOfFundingPeriod = computed(() => {
  if (isNil(fundingPeriod.value)) return null

  const { fromDate } = fundingPeriod.value
  return DateTimeUtils.fromISO(fromDate, { zone: "utc" }).toISODate()
})
const endOfFundingPeriod = computed(() => {
  if (isNil(fundingPeriod.value)) return null

  const { toDate } = fundingPeriod.value
  return DateTimeUtils.fromISO(toDate, { zone: "utc" }).toISODate()
})
const paidOnDateRangeValidator = computed(() =>
  dateBetween(startOfFundingPeriod.value, endOfFundingPeriod.value, {
    minLabel: "start of funding period",
    maxLabel: "end of funding period",
  })
)


const isCreating = ref(false)
const snack = useSnack()
const headerActionsFormCard = useTemplateRef("headerActionsFormCard")

async function createPayment() {
  if (headerActionsFormCard.value === null) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isCreating.value = true
  try {
    const { payment } = await paymentsApi.create(paymentAttributes.value)
    emit("created", payment.id)
    snack.success("Payment created successfully")
  } catch (error) {
    console.error(`Failed to create payment: ${error}`, { error })
    snack.error(`Failed to create payment: ${error}`)
  } finally {
    isCreating.value = false
  }
}
</script>
