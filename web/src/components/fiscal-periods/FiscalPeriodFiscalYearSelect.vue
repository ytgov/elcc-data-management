<template>
  <v-select
    :model-value="modelValue"
    label="Fiscal year"
    :items="fiscalYears"
    :loading="isLoading"
    @update:model-value="updateModelValue"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { uniqBy } from "lodash"

import { MAX_PER_PAGE } from "@/api/base-api"
import useFiscalPeriods, { FiscalPeriod } from "@/use/use-fiscal-periods"

defineProps<{
  modelValue: string | null | undefined
}>()

const emit = defineEmits(["update:modelValue"])

const fiscalPeriodsQuery = computed(() => ({
  perPage: MAX_PER_PAGE, // TODO: remove once dedicated endpoint exists.
}))
const { fiscalPeriods, isLoading } = useFiscalPeriods(fiscalPeriodsQuery)

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
