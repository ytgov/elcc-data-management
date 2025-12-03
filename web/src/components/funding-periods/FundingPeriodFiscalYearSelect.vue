<template>
  <v-select
    :model-value="modelValue"
    label="Fiscal Year"
    :items="fiscalYears"
    :loading="isLoading"
    @update:model-value="updateModelValue"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { map, uniq } from "lodash"

import { MAX_PER_PAGE } from "@/api/base-api"
import useFundingPeriods from "@/use/use-funding-periods"

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    formatValue?: (value: string) => string
  }>(),
  {
    formatValue: (value: string) => value,
  }
)

const emit = defineEmits(["update:modelValue"])

const fundingPeriodsQuery = computed(() => ({
  perPage: MAX_PER_PAGE, // TODO: replace with search component or limit to most likely relevant funding periods.
}))
const { fundingPeriods, isLoading } = useFundingPeriods(fundingPeriodsQuery)
const fiscalYears = computed(() =>
  uniq(map(fundingPeriods.value, "fiscalYear")).map((fiscalYear) => ({
    title: fiscalYear,
    value: props.formatValue(fiscalYear),
  }))
)
function updateModelValue(value: string) {
  emit("update:modelValue", value)
}
</script>
