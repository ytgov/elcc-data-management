<template>
  <v-skeleton-loader
    v-if="isNil(employeeWageTier)"
    type="table-row"
  />
  <tbody v-else>
    <!-- TODO: set this up with auto-save -->
    <tr class="bg-grey-lighten-2">
      <td>{{ employeeWageTier.tierLabel }}</td>
      <td colspan="5"></td>
      <td class="d-flex justify-end align-center">
        <v-btn
          title="Add employee"
          icon="$plus"
          density="comfortable"
          color="yg-blue"
          :loading="isCreating"
          @click="createWageEnhancement"
        />
      </td>
    </tr>
    <tr
      v-for="wageEnhancement in wageEnhancements"
      :key="`enhancement-${wageEnhancement.id}`"
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
          :model-value="formatMoney(calculateTotal(wageEnhancement, 'hoursEstimated'))"
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
          :model-value="formatMoney(calculateTotal(wageEnhancement, 'hoursActual'))"
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
  </tbody>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRefs } from "vue"
import { isNil } from "lodash"
import Big from "big.js"

import { formatMoney } from "@/utils/formatters"

import { MAX_PER_PAGE } from "@/api/base-api"
import wageEnhancementsApi from "@/api/wage-enhancements-api"
import useEmployeeWageTier from "@/use/use-employee-wage-tier"
import useWageEnhancements, { type WageEnhancement } from "@/use/use-wage-enhancements"
import useSnack from "@/use/use-snack"

const props = defineProps<{
  centreId: number
  employeeWageTierId: number
}>()

const emit = defineEmits<{
  updated: [wageEnhancementId: number]
}>()

const { employeeWageTierId } = toRefs(props)
const { employeeWageTier } = useEmployeeWageTier(employeeWageTierId)

const wageEnhancementsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    employeeWageTierId: props.employeeWageTierId,
  },
  perPage: MAX_PER_PAGE, // TODO: switch to paginated table.
}))
const { wageEnhancements, refresh } = useWageEnhancements(wageEnhancementsQuery)

function calculateTotal(
  wageEnhancement: WageEnhancement,
  attribute: keyof Pick<WageEnhancement, "hoursEstimated" | "hoursActual">
): string {
  if (isNil(employeeWageTier.value)) return "0.0000"

  const { wageRatePerHour } = employeeWageTier.value
  if (isNil(wageRatePerHour)) return "0.0000"

  const hours = wageEnhancement[attribute]
  if (isNil(hours)) return "0.0000"

  return Big(hours).mul(wageRatePerHour).toFixed(4)
}

const snack = useSnack()
const isCreating = ref(false)
const isLoadingByWageEnhancementId = reactive(new Map<number, boolean>())

async function createWageEnhancement() {
  isCreating.value = true
  try {
    await wageEnhancementsApi.create({
      employeeWageTierId: props.employeeWageTierId,
      centreId: props.centreId,
      employeeName: "",
      hoursEstimated: "0",
      hoursActual: "0",
    })
    snack.success("Wage enhancement created")

    await refresh()
  } catch (error) {
    console.error(`Failed to create wage enhancement: ${error}`, { error })
    snack.error(`Failed to create wage enhancement: ${error}`)
  } finally {
    isCreating.value = false
  }
}

async function updateWageEnhancement(
  wageEnhancementId: number,
  attributes: Partial<WageEnhancement>
) {
  isLoadingByWageEnhancementId.set(wageEnhancementId, true)
  try {
    await wageEnhancementsApi.update(wageEnhancementId, attributes)
    snack.success("Wage enhancement saved!")
    emit("updated", wageEnhancementId)

    await nextTick()
    await refresh()
  } catch (error) {
    console.error(`Failed to update wage enhancement: ${error}`, { error })
    snack.error(`Failed to update wage enhancement: ${error}`)
  } finally {
    isLoadingByWageEnhancementId.set(wageEnhancementId, false)
  }
}

async function deleteWageEnhancement(wageEnhancementId: number) {
  isLoadingByWageEnhancementId.set(wageEnhancementId, true)
  try {
    await wageEnhancementsApi.delete(wageEnhancementId)
    snack.success("Wage enhancement deleted.")
    emit("updated", wageEnhancementId)

    await nextTick()
    await refresh()
  } catch (error) {
    console.error(`Failed to delete wage enhancement: ${error}`, { error })
    snack.error(`Failed to delete wage enhancement: ${error}`)
  } finally {
    isLoadingByWageEnhancementId.delete(wageEnhancementId)
  }
}

async function updateAll() {
  const wageEnhancementsPromises = wageEnhancements.value.map(({ id, ...attributes }) =>
    updateWageEnhancement(id, attributes)
  )

  await Promise.all(wageEnhancementsPromises)
}

defineExpose({
  updateAll,
})
</script>
