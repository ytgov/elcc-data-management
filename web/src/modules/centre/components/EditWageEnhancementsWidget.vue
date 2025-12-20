<template>
  <v-table>
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
    <WageEnhancementTierTableBody
      v-for="employeeWageTier in employeeWageTiers"
      :key="employeeWageTier.id"
      ref="wageEnhancementTierTableBodies"
      :centre-id="props.centreId"
      :employee-wage-tier-id="employeeWageTier.id"
      @updated="refresh"
    />
    <tbody>
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

<script setup lang="ts">
import { computed, ref } from "vue"
import { isNil, keyBy, mapValues } from "lodash"
import Big from "big.js"

import { formatMoney } from "@/utils/formatters"

import { MAX_PER_PAGE } from "@/api/base-api"
import useEmployeeWageTiers from "@/use/use-employee-wage-tiers"
import useWageEnhancements, { EI_CPP_WCB_RATE } from "@/use/use-wage-enhancements"
import useSnack from "@/use/use-snack"

import WageEnhancementTierTableBody from "@/components/wage-enhancements/WageEnhancementTierTableBody.vue"

const props = defineProps<{
  centreId: number
  fiscalPeriodId: number
}>()

const employeeWageTiersQuery = computed(() => ({
  where: {
    fiscalPeriodId: props.fiscalPeriodId,
  },
}))

const { employeeWageTiers, isLoading: isLoadingEmployeeWageTiers } =
  useEmployeeWageTiers(employeeWageTiersQuery)
const employeeWageTierIds = computed(() => employeeWageTiers.value.map(({ id }) => id))

const wageEnhancementsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    employeeWageTierId: employeeWageTierIds.value,
  },
  perPage: MAX_PER_PAGE, // TODO: push this calculation to the back-end
}))

const { wageEnhancements, refresh } = useWageEnhancements(wageEnhancementsQuery, {
  skipWatchIf: () => isLoadingEmployeeWageTiers.value,
})

const wageRatePerHoursByEmployeeWageTierId = computed(() =>
  mapValues(keyBy(employeeWageTiers.value, "id"), "wageRatePerHour")
)

const wageEnhancementsEstimatedSubtotal = computed(() =>
  wageEnhancements.value.reduce((total, { hoursEstimated, employeeWageTierId }) => {
    const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId.value[employeeWageTierId]
    if (isNil(wageRatePerHour)) return total

    return Big(total).add(Big(hoursEstimated).mul(Big(wageRatePerHour)))
  }, Big(0))
)

const wageEnhancementsActualSubtotal = computed(() =>
  wageEnhancements.value.reduce((total, { hoursActual, employeeWageTierId }) => {
    const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId.value[employeeWageTierId]
    if (isNil(wageRatePerHour)) return total

    return Big(total).add(Big(hoursActual).mul(Big(wageRatePerHour)))
  }, Big(0))
)

const wageEnhancementsEstimatedEiCppWcbTotal = computed(() =>
  wageEnhancementsEstimatedSubtotal.value.mul(Big(EI_CPP_WCB_RATE))
)

const wageEnhancementsActualEiCppWcbTotal = computed(() =>
  wageEnhancementsActualSubtotal.value.mul(Big(EI_CPP_WCB_RATE))
)

const wageEnhancementsEstimatedTotal = computed(() =>
  wageEnhancementsEstimatedSubtotal.value.mul(Big(1).plus(Big(EI_CPP_WCB_RATE)))
)

const wageEnhancementsActualTotal = computed(() =>
  wageEnhancementsActualSubtotal.value.mul(Big(1).plus(Big(EI_CPP_WCB_RATE)))
)

const eiCppWcbRatePercentage = computed(() => Big(EI_CPP_WCB_RATE).mul(Big(100)).toFixed(2))

const isLoading = ref(false)
const snack = useSnack()
const wageEnhancementTierTableBodies = ref<InstanceType<typeof WageEnhancementTierTableBody>[]>([])

async function updateAllWageEnhancements() {
  isLoading.value = true
  try {
    const updateWageEnhancementPromises = wageEnhancementTierTableBodies.value.map(
      (wageEnhancementTierTableBody) => wageEnhancementTierTableBody.updateAll()
    )
    await Promise.all(updateWageEnhancementPromises)
    snack.success("All wage enhancements saved")
  } catch (error) {
    console.error(`Failed to update all wage enhancements: ${error}`, { error })
    snack.error(`Failed to update all wage enhancements: ${error}`)
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
