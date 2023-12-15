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
        <th></th>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="employeeWageTier in employeeWageTiers"
        :key="employeeWageTier.id"
      >
        <tr class="bg-grey-lighten-2">
          <td>{{ employeeWageTier.tierLabel }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="d-flex justify-end align-center">
            <v-btn
              title="Add employee"
              icon="$plus"
              density="comfortable"
              color="yg-blue"
              :loading="isLoadingByEmployeeWageTier.get(employeeWageTier.id)"
              @click="createWageEnhancement(employeeWageTier.id)"
            ></v-btn>
          </td>
        </tr>
        <tr
          v-for="wageEnhancement in wageEnhancementsByEmployeeWageTier[employeeWageTier.id]"
          :key="wageEnhancement.id"
        >
          <td>
            <v-text-field
              v-model="wageEnhancement.employeeName"
              aria-label="Employee Name"
              density="compact"
              variant="underlined"
              hide-details
            />
          </td>
          <td>{{ formatMoney(employeeWageTier.wageRatePerHour) }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="d-flex justify-end align-center">
            <v-btn
              icon="mdi-content-save"
              title="Save"
              density="comfortable"
              variant="text"
              :loading="isLoadingByWageEnhancement.get(wageEnhancement.id)"
              @click="updateWageEnhancement(wageEnhancement.id, wageEnhancement)"
            >
            </v-btn>
            <v-btn
              icon="mdi-close"
              title="Delete"
              class="ml-2"
              color="error"
              density="comfortable"
              variant="text"
              :loading="isLoadingByWageEnhancement.get(wageEnhancement.id)"
              @click="deleteWageEnhancement(wageEnhancement.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>
      <!--
        wage total:                $88,988.52
        plus 14%, EI, CPP, WCB      14% -> $12,458.39
				final total:                $101,446.91
       -->
      <!-- TODO: add total row striping bg-grey-lighten-2 -->
      <tr>
        <td class="text-uppercase">Section Total</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive } from "vue"
import { groupBy } from "lodash"

import employeeWageTiersApi, { type EmployeeWageTier } from "@/api/employee-wage-tiers-api"
import wageEnhancementsApi, { type WageEnhancement } from "@/api/wage-enhancements-api"
import { formatMoney } from "@/utils"

// TODO: store this in the back-end, probably in the fiscal_periods table
const EI_CPP_WCB_RATE = 0.14

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
const isLoadingByEmployeeWageTier = reactive(new Map<number, boolean>())
const isLoadingByWageEnhancement = reactive(new Map<number, boolean>())

async function fetchEmployeeWageTiers() {
  isLoading.value = true
  try {
    const { employeeWageTiers: newEmployeeWageTiers } = await employeeWageTiersApi.list({
      where: {
        fiscalPeriodId: props.fiscalPeriodId,
      },
    })
    employeeWageTiers.value = newEmployeeWageTiers
    return newEmployeeWageTiers
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function fetchWageEnhancements() {
  isLoading.value = true
  try {
    const { wageEnhancements: newWageEnhancements } = await wageEnhancementsApi.list({
      where: {
        centreId: props.centreId,
        employeeWageTierId: employeeWageTierIds.value,
      },
    })
    wageEnhancements.value = newWageEnhancements
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function createWageEnhancement(employeeWageTierId: number) {
  isLoadingByEmployeeWageTier.set(employeeWageTierId, true)
  try {
    const { wageEnhancement: newWageEnhancement } = await wageEnhancementsApi.create({
      employeeWageTierId,
      centreId: props.centreId,
      employeeName: "",
      hoursEstimated: 0,
      hoursActual: 0,
    })
    wageEnhancements.value.push(newWageEnhancement)
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingByEmployeeWageTier.set(employeeWageTierId, false)
  }
}

async function updateWageEnhancement(
  wageEnhancementId: number,
  attributes: Partial<WageEnhancement>
) {
  isLoadingByWageEnhancement.set(wageEnhancementId, true)
  try {
    const { wageEnhancement: newWageEnhancement } = await wageEnhancementsApi.update(
      wageEnhancementId,
      attributes
    )

    const index = wageEnhancements.value.findIndex(({ id }) => id === wageEnhancementId)
    if (index === -1) {
      wageEnhancements.value.push(newWageEnhancement)
    } else {
      wageEnhancements.value[index] = newWageEnhancement
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingByWageEnhancement.set(wageEnhancementId, false)
  }
}

async function deleteWageEnhancement(wageEnhancementId: number) {
  isLoadingByWageEnhancement.set(wageEnhancementId, true)
  try {
    await wageEnhancementsApi.delete(wageEnhancementId)
    const index = wageEnhancements.value.findIndex(({ id }) => id === wageEnhancementId)

    if (index !== -1) {
      wageEnhancements.value.splice(index, 1)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingByWageEnhancement.set(wageEnhancementId, false)
  }
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
