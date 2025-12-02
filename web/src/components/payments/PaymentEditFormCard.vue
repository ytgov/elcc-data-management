<template>
  <v-skeleton-loader
    v-if="isNil(payment)"
    type="card"
  />
  <HeaderActionsFormCard
    v-else
    ref="headerActionsFormCard"
    @submit.prevent="updatePayment"
  >
    <template #header>
      <h4>Edit Payment</h4>
    </template>

    <v-text-field
      v-model="payment.name"
      label="Payment Name"
      :rules="[required]"
      density="comfortable"
    />

    <CurrencyInput
      v-model="payment.amount"
      label="Payment Amount"
      :rules="[required, greaterThan(0)]"
      density="comfortable"
    />

    <StringDateInput
      v-model="payment.paidOn"
      label="Paid On"
      :rules="[required, paidOnDateRangeValidator]"
      density="comfortable"
      :min="startOfFiscalPeriod"
      :max="endOfFiscalPeriod"
    />

    <template #actions>
      <v-btn
        color="primary"
        type="submit"
        :loading="isUpdating"
      >
        Update
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
import { computed, ref, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import DateTimeUtils from "@/utils/date-time-utils"
import { dateBetween, greaterThan, required } from "@/utils/validators"

import paymentsApi from "@/api/payments-api"

import useSnack from "@/use/use-snack"
import usePayment from "@/use/use-payment"

import CurrencyInput from "@/components/CurrencyInput.vue"
import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"
import StringDateInput from "@/components/common/StringDateInput.vue"

const props = defineProps<{
  paymentId: number
  fiscalYearLegacy: string
}>()

const emit = defineEmits<{
  updated: [paymentId: number]
  cancel: [void]
}>()

const { paymentId } = toRefs(props)
const { payment } = usePayment(paymentId)


const fiscalPeriod = computed(() => payment.value?.fiscalPeriod)
const startOfFiscalPeriod = computed(() => {
  if (isNil(fiscalPeriod.value)) return null

  const { dateStart } = fiscalPeriod.value
  return DateTimeUtils.fromISO(dateStart, { zone: "utc" }).toISODate()
})
const endOfFiscalPeriod = computed(() => {
  if (isNil(fiscalPeriod.value)) return null

  const { dateEnd } = fiscalPeriod.value
  return DateTimeUtils.fromISO(dateEnd, { zone: "utc" }).toISODate()
})
const paidOnDateRangeValidator = computed(() =>
  dateBetween(startOfFiscalPeriod.value, endOfFiscalPeriod.value, {
    minLabel: "start of fiscal period",
    maxLabel: "end of fiscal period",
  })
)

const isUpdating = ref(false)
const snack = useSnack()
const headerActionsFormCard = useTemplateRef("headerActionsFormCard")

async function updatePayment() {
  if (isNil(payment.value)) return
  if (headerActionsFormCard.value === null) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isUpdating.value = true
  try {
    await paymentsApi.update(props.paymentId, payment.value)
    emit("updated", props.paymentId)
    snack.success("Payment updated successfully")
  } catch (error) {
    console.error(`Failed to update payment: ${error}`, { error })
    snack.error(`Failed to update payment: ${error}`)
  } finally {
    isUpdating.value = false
  }
}
</script>
