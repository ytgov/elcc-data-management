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
import { ref, onMounted } from "vue"
import { uniqBy } from "lodash"

import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"

defineProps({
  modelValue: String,
})

const emit = defineEmits(["update:modelValue"])

const fiscalYears = ref<string[]>([])
const isLoading = ref(true)

function updateModelValue(value: string) {
  emit("update:modelValue", value)
}

async function fetchFiscalPeriods() {
  isLoading.value = true
  const { fiscalPeriods: newFiscalPeriods } = await fiscalPeriodsApi.list()
  fiscalYears.value = uniqBy(newFiscalPeriods, "fiscalYear").map(
    (fiscalPeriod: FiscalPeriod) => fiscalPeriod.fiscalYear
  )
  isLoading.value = false
}

onMounted(async () => {
  await fetchFiscalPeriods()
})
</script>
