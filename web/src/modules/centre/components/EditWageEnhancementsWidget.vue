<template>
  <v-skeleton-loader
    type="table"
    v-if="isEmpty(employeeWageTiers) && isEmpty(wageEnhancementsByEmployeeWageTierId) && isLoading"
  ></v-skeleton-loader>
  <v-table v-else>
    <thead>
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
        :key="`employee-wage-tier-${employeeWageTier.id}`"
      >
        <tr class="bg-grey-lighten-2">
          <td>{{ employeeWageTier.tierLabel }}</td>
          <td colspan="5"></td>
          <td class="d-flex justify-end align-center">
            <v-btn
              title="Add employee"
              icon="$plus"
              density="comfortable"
              color="yg-blue"
              :loading="isLoadingByEmployeeWageTierId.get(employeeWageTier.id)"
              @click="createWageEnhancement(employeeWageTier.id)"
            ></v-btn>
          </td>
        </tr>
        <tr
          v-for="wageEnhancement in wageEnhancementsByEmployeeWageTierId[employeeWageTier.id]"
          :key="`wage-enhancement-${wageEnhancement.id}`"
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
          <td>
            <v-text-field
              :model-value="formatMoney(employeeWageTier.wageRatePerHour)"
              aria-label="Wage Rate Per Hour"
              color="primary"
              density="compact"
              tabindex="-1"
              variant="plain"
              hide-details
              readonly
            />
          </td>
          <td>
            <v-text-field
              v-model="wageEnhancement.hoursEstimated"
              aria-label="Hours Estimated"
              density="compact"
              variant="underlined"
              hide-details
            />
          </td>
          <td>
            <v-text-field
              :model-value="
                formatMoney(wageEnhancement.hoursEstimated * employeeWageTier.wageRatePerHour)
              "
              aria-label="Wage Enhancement Total Estimated"
              color="primary"
              density="compact"
              tabindex="-1"
              variant="plain"
              hide-details
              readonly
            />
          </td>
          <td>
            <v-text-field
              v-model="wageEnhancement.hoursActual"
              aria-label="Hours Actual"
              density="compact"
              variant="underlined"
              hide-details
            />
          </td>
          <td>
            <v-text-field
              :model-value="
                formatMoney(wageEnhancement.hoursActual * employeeWageTier.wageRatePerHour)
              "
              aria-label="Wage Enhancement Total Actual"
              color="primary"
              density="compact"
              tabindex="-1"
              variant="plain"
              hide-details
              readonly
            />
          </td>
          <td class="d-flex justify-end align-center">
            <v-btn
              icon="mdi-content-save"
              title="Save"
              density="comfortable"
              variant="text"
              :loading="isLoadingByWageEnhancementId.get(wageEnhancement.id)"
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
              :loading="isLoadingByWageEnhancementId.get(wageEnhancement.id)"
              @click="deleteWageEnhancement(wageEnhancement.id)"
            >
            </v-btn>
          </td>
        </tr>
      </template>
      <tr class="thin-solid-black-top-border">
        <td colspan="3"></td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsEstimatedSubtotal)"
            aria-label="Wage Enhancement Total Estimated"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsActualSubtotal)"
            aria-label="Wage Enhancement Total Actual"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <td>Plus {{ eiCppWcbRatePercentage }}%, EI, CPP, WCB</td>
        <td></td>
        <td>
          <v-text-field
            :model-value="`${eiCppWcbRatePercentage}%`"
            aria-label="EI CPP WCB Rate Percentage"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsEstimatedEiCppWcbTotal)"
            aria-label="Wage Enhancement Estimated EI CPP WCB Total"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsActualEiCppWcbTotal)"
            aria-label="Wage Enhancement Actual EI CPP WCB Total"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
      </tr>
      <tr class="thin-solid-black-top-border thicker-double-black-bottom-border">
        <td class="text-uppercase">Section Total</td>
        <td colspan="2"></td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsEstimatedTotal)"
            aria-label="Wage Enhancement Estimated Total"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
        <td>
          <v-text-field
            :model-value="formatMoney(wageEnhancementsActualTotal)"
            aria-label="Wage Enhancement Actual Total"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
        <td></td>
      </tr>
    </tbody>
  </v-table>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          color="success"
          :loading="isLoading"
          @click="updateAllWageEnhancements"
        >
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, watch, reactive } from "vue"
import { groupBy, keyBy, mapValues, round, isEmpty } from "lodash"

import { formatMoney } from "@/utils/formatters"
import employeeWageTiersApi, { type EmployeeWageTier } from "@/api/employee-wage-tiers-api"
import wageEnhancementsApi, {
  EI_CPP_WCB_RATE,
  type WageEnhancement,
} from "@/api/wage-enhancements-api"
import { useNotificationStore } from "@/store/NotificationStore"

const notificationStore = useNotificationStore()

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
const isLoadingByEmployeeWageTierId = reactive(new Map<number, boolean>())
const isLoadingByWageEnhancementId = reactive(new Map<number, boolean>())

const employeeWageTiers = ref<EmployeeWageTier[]>([])
const employeeWageTierIds = computed(() => employeeWageTiers.value.map(({ id }) => id))

const wageEnhancements = ref<WageEnhancement[]>([])
const wageEnhancementsByEmployeeWageTierId = computed(() =>
  groupBy(wageEnhancements.value, "employeeWageTierId")
)
const wageRatePerHoursByEmployeeWageTierId = computed(() =>
  mapValues(keyBy(employeeWageTiers.value, "id"), "wageRatePerHour")
)
const wageEnhancementsEstimatedSubtotal = computed(() =>
  wageEnhancements.value.reduce((total, { hoursEstimated, employeeWageTierId }) => {
    const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId.value[employeeWageTierId]

    return total + hoursEstimated * wageRatePerHour
  }, 0)
)
const wageEnhancementsActualSubtotal = computed(() =>
  wageEnhancements.value.reduce((total, { hoursActual, employeeWageTierId }) => {
    const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId.value[employeeWageTierId]

    return total + hoursActual * wageRatePerHour
  }, 0)
)
const wageEnhancementsEstimatedEiCppWcbTotal = computed(
  () => wageEnhancementsEstimatedSubtotal.value * EI_CPP_WCB_RATE
)
const wageEnhancementsActualEiCppWcbTotal = computed(
  () => wageEnhancementsActualSubtotal.value * EI_CPP_WCB_RATE
)
const wageEnhancementsEstimatedTotal = computed(
  () => wageEnhancementsEstimatedSubtotal.value * (1 + EI_CPP_WCB_RATE)
)
const wageEnhancementsActualTotal = computed(
  () => wageEnhancementsActualSubtotal.value * (1 + EI_CPP_WCB_RATE)
)

const eiCppWcbRatePercentage = computed(() => {
  return round(EI_CPP_WCB_RATE * 100, 2)
})

watch(
  () => props.fiscalPeriodId,
  async () => {
    await fetchEmployeeWageTiers()
    await fetchWageEnhancements()
  },
  { immediate: true }
)

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
    notificationStore.notify({
      text: `Failed to fetch employee wage tiers: ${error}`,
      variant: "error",
    })
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
    notificationStore.notify({
      text: `Failed to fetch wage enhancements: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}

async function createWageEnhancement(employeeWageTierId: number) {
  isLoadingByEmployeeWageTierId.set(employeeWageTierId, true)
  try {
    const { wageEnhancement: newWageEnhancement } = await wageEnhancementsApi.create({
      employeeWageTierId,
      centreId: props.centreId,
      employeeName: "",
      hoursEstimated: 0,
      hoursActual: 0,
    })
    wageEnhancements.value.push(newWageEnhancement)
    notificationStore.notify({
      text: "Wage enhancement created",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to create wage enhancement: ${error}`,
      variant: "error",
    })
  } finally {
    isLoadingByEmployeeWageTierId.set(employeeWageTierId, false)
  }
}

async function updateWageEnhancement(
  wageEnhancementId: number,
  attributes: Partial<WageEnhancement>
) {
  isLoadingByWageEnhancementId.set(wageEnhancementId, true)
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
    notificationStore.notify({
      text: "Wage enhancement saved",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to update wage enhancement: ${error}`,
      variant: "error",
    })
  } finally {
    isLoadingByWageEnhancementId.set(wageEnhancementId, false)
  }
}

async function deleteWageEnhancement(wageEnhancementId: number) {
  isLoadingByWageEnhancementId.set(wageEnhancementId, true)
  try {
    await wageEnhancementsApi.delete(wageEnhancementId)
    const index = wageEnhancements.value.findIndex(({ id }) => id === wageEnhancementId)

    if (index !== -1) {
      wageEnhancements.value.splice(index, 1)
    }
    notificationStore.notify({
      text: "Wage enhancement deleted",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to delete wage enhancement: ${error}`,
      variant: "error",
    })
  } finally {
    isLoadingByWageEnhancementId.delete(wageEnhancementId)
  }
}

async function updateAllWageEnhancements() {
  isLoading.value = true
  try {
    const updateWageEnhancementPromises = wageEnhancements.value.map(({ id, ...attributes }) =>
      wageEnhancementsApi.update(id, attributes)
    )
    await Promise.all(updateWageEnhancementPromises)
    notificationStore.notify({
      text: "All wage enhancements saved",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to update all wage enhancements: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.thin-solid-black-top-border > td {
  border-top: thin solid black;
}

.thicker-double-black-bottom-border > td {
  border-bottom: 3px double black;
}
</style>
