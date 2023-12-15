<template>
  <v-table>
    <thead>
      <!-- TODO: add vertical column striping bg-grey-lighten-2 -->
      <tr>
        <th></th>
        <th class="text-left">Per Employee</th>
        <th class="text-left">Est. Hours</th>
        <th class="text-left">Est. Total</th>
        <th class="text-left">Act. Hours</th>
        <th class="text-left">Act. Total</th>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="{ id: employeeWageTierId, tierLabel, wageRatePerHour } in employeeWageTiers"
        :key="employeeWageTierId"
      >
        <tr class="bg-grey-lighten-2">
          <td>{{ tierLabel }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="d-flex justify-center align-center">
            <v-btn
              title="Add employee"
              icon="$plus"
              density="comfortable"
              color="success"
              @click="createWageEnhancement(employeeWageTierId)"
            ></v-btn>
          </td>
        </tr>
        <tr
          v-for="{ id: wageEnhancementId, employeeName } in wageEnhancementsByEmployeeWageTier[
            employeeWageTierId
          ]"
          :key="wageEnhancementId"
        >
          <td>{{ employeeName }}</td>
          <td>{{ formatMoney(wageRatePerHour) }}</td>
        </tr>
      </template>
      <!-- TODO: add total row striping bg-grey-lighten-2 -->
      <tr>
        <td class="text-uppercase">Section Total</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { groupBy } from "lodash"

import employeeWageTiersApi, { type EmployeeWageTier } from "@/api/employee-wage-tiers-api"
import wageEnhancementsApi, { type WageEnhancement } from "@/api/wage-enhancements-api"
import { formatMoney } from "@/utils"

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
const employeeWageTierIds = computed(() => employeeWageTiers.value.map(({ id }) => id))

const wageEnhancements = ref<WageEnhancement[]>([])
const wageEnhancementsByEmployeeWageTier = computed(() =>
  groupBy(wageEnhancements.value, "employeeWageTierId")
)

async function fetchEmployeeWageTiers() {
  isLoading.value = true
  const { employeeWageTiers: newEmployeeWageTiers } = await employeeWageTiersApi.list({
    where: {
      fiscalPeriodId: props.fiscalPeriodId,
    },
  })
  employeeWageTiers.value = newEmployeeWageTiers
  isLoading.value = false

  return newEmployeeWageTiers
}

async function fetchWageEnhancements() {
  isLoading.value = true
  const { wageEnhancements: newWageEnhancements } = await wageEnhancementsApi.list({
    where: {
      centreId: props.centreId,
      employeeWageTierId: employeeWageTierIds.value,
    },
  })
  wageEnhancements.value = newWageEnhancements
  isLoading.value = false
}

async function createWageEnhancement(employeeWageTierId: number) {
  isLoading.value = true
  const { wageEnhancement: newWageEnhancement } = await wageEnhancementsApi.create({
    employeeWageTierId,
    centreId: props.centreId,
    employeeName: "",
    hoursEstimated: 0,
    hoursActual: 0,
  })
  wageEnhancements.value = [...wageEnhancements.value, newWageEnhancement]
  isLoading.value = false
}

watch(
  () => props.fiscalPeriodId,
  async () => {
    await fetchEmployeeWageTiers()
    await fetchWageEnhancements()
  },
  { immediate: true }
)
</script>
