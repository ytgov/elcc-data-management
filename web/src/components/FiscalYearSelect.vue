<template>
  <v-select
    :model-value="modelValue"
    :items="fiscalYears"
    :loading="isLoading"
    label="Fiscal year"
    @update:model-value="updateModelValue"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { uniqBy } from "lodash"

import useFiscalPeriods, { FiscalPeriod } from "@/use/use-fiscal-periods"

defineProps({
  modelValue: String,
})

const emit = defineEmits(["update:modelValue"])

const { fiscalPeriods, isLoading } = useFiscalPeriods()
// TODO: add a special scope or endpoint to support loading just the fiscal years
const fiscalYears = computed(() =>
  uniqBy(fiscalPeriods.value, "fiscalYear").map(
    (fiscalPeriod: FiscalPeriod) => fiscalPeriod.fiscalYear
  )
)

function updateModelValue(value: string) {
  emit("update:modelValue", value)
}
</script>
