<template>
  TODO: some wage enhancement stuff

  <v-container>
    <v-row
      v-for="{ id, tierLabel } in employeeWageTiers"
      :key="id"
    >
      <v-col>{{ tierLabel }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import employeeWageTiersApi, { EmployeeWageTier } from "@/api/employee-wage-tiers-api"

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalPeriodId: {
    type: Number,
    required: true,
  },
})

const isLoading = ref(true)
const employeeWageTiers = ref<EmployeeWageTier[]>([])

async function fetchEmployeeWageTiers() {
  isLoading.value = true
  employeeWageTiers.value = await employeeWageTiersApi
    .list({ where: { fiscalPeriodId: props.fiscalPeriodId } })
    .then(({ employeeWageTiers }) => employeeWageTiers)
  isLoading.value = false
}

watch(
  () => props.fiscalPeriodId,
  async () => {
    await fetchEmployeeWageTiers()
  },
  { immediate: true }
)
</script>
