<template>
  <v-skeleton-loader
    v-if="isNil(employeeBenefit)"
    type="table"
  />
  <v-table v-else>
    <thead>
      <tr>
        <th></th>
        <th class="text-left">Est. Total</th>
        <th></th>
        <th class="text-left">Act. Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Gross Payroll</td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.grossPayrollMonthlyEstimated)"
            aria-label="Gross Payroll Monthly Estimated"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="
              updateEmployeeBenefitCurrencyValue('grossPayrollMonthlyEstimated', $event)
            "
          />
        </td>
        <td></td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.grossPayrollMonthlyActual)"
            aria-label="Gross Payroll Monthly Actual"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="
              updateEmployeeBenefitCurrencyValue('grossPayrollMonthlyActual', $event)
            "
          />
        </td>
      </tr>
      <tr>
        <td>
          {{ costCapPercentage }}% of above
          <!-- TODO: clean up this code -->
          <v-btn
            aria-label="show/hide cost cap percentage input"
            size="x-small"
            icon="mdi-pencil"
            density="comfortable"
            color="yg-blue"
            :variant="isEditingCostCapPercentage ? 'outlined' : 'tonal'"
            @click="isEditingCostCapPercentage = !isEditingCostCapPercentage"
          >
          </v-btn>
          <v-text-field
            v-if="isEditingCostCapPercentage"
            :model-value="costCapPercentage"
            aria-label="Cost Cap Percentage"
            color="primary"
            density="compact"
            type="number"
            variant="plain"
            hide-details
            @update:model-value="updateCostCapPercentage"
          />
        </td>
        <td>
          <v-text-field
            :model-value="formatMoney(monthlyBenefitCostCapEstimated)"
            aria-label="Monthly Benefit Cost Cap Estimated"
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
            :model-value="formatMoney(monthlyBenefitCostCapActual)"
            aria-label="Monthly Benefit Cost Cap Actual"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
      </tr>
      <tr>
        <td>Employee Cost</td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.employeeCostEstimated)"
            aria-label="Employee Cost Estimated"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="
              updateEmployeeBenefitCurrencyValue('employeeCostEstimated', $event)
            "
          />
        </td>
        <td></td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.employeeCostActual)"
            aria-label="Employee Cost Actual"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="updateEmployeeBenefitCurrencyValue('employeeCostActual', $event)"
          />
        </td>
      </tr>
      <tr>
        <td>Employer Cost</td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.employerCostEstimated)"
            aria-label="Employer Cost Estimated"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="
              updateEmployeeBenefitCurrencyValue('employerCostEstimated', $event)
            "
          />
        </td>
        <td></td>
        <td>
          <CurrencyInput
            :model-value="Number(employeeBenefit.employerCostActual)"
            aria-label="Employer Cost Actual"
            color="primary"
            density="compact"
            variant="underlined"
            hide-details
            @update:model-value="updateEmployeeBenefitCurrencyValue('employerCostActual', $event)"
          />
        </td>
      </tr>
      <tr>
        <td class="d-flex align-center">
          Total Cost
          <v-tooltip location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-icon
                class="ml-1"
                v-bind="activatorProps"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="text-white"> Totaling the sum of Employee Cost plus Employer Cost </span>
          </v-tooltip>
        </td>
        <td>
          <v-text-field
            :model-value="formatMoney(totalCostEstimated)"
            aria-label="Total Cost Estimated"
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
            :model-value="formatMoney(totalCostActual)"
            aria-label="Total Cost Actual"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
      </tr>
      <tr>
        <td class="text-uppercase d-flex align-center">
          Paid Amount
          <v-tooltip location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-icon
                class="ml-1"
                v-bind="activatorProps"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="text-white">
              Totaling the lesser of either {{ costCapPercentage }}% of Gross Payroll or Employer
              Cost
            </span>
          </v-tooltip>
        </td>
        <td>
          <v-text-field
            :model-value="formatMoney(minimumPaidAmountEstimated)"
            aria-label="Minimum Paid Amount Estimated"
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
            :model-value="formatMoney(minimumPaidAmountActual)"
            aria-label="Minimum Paid Amount Actual"
            color="primary"
            density="compact"
            tabindex="-1"
            variant="plain"
            hide-details
            readonly
          />
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="d-flex justify-end pt-4">
          <v-btn
            color="success"
            :loading="isLoading"
            @click="saveAndNotify"
          >
            Save
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue"
import { isNil, round } from "lodash"

import { formatMoney } from "@/utils/formatters"

import useSnack from "@/use/use-snack"
import useEmployeeBenefit from "@/use/use-employee-benefit"

import CurrencyInput from "@/components/CurrencyInput.vue"

const props = defineProps<{
  employeeBenefitId: number
}>()

const { employeeBenefitId } = toRefs(props)
const { employeeBenefit, isLoading, save } = useEmployeeBenefit(employeeBenefitId)

const isEditingCostCapPercentage = ref(false)

// NOTE: if you type 8.215, it will round to 8.22
// successive presses of 5 or higher will continue increasing the value
const costCapPercentage = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return round(Number(employeeBenefit.value.costCapPercentage) * 100, 2)
})

function updateCostCapPercentage(newValue: string | number) {
  if (isNil(employeeBenefit.value)) {
    return
  }

  const newValueNumber = parseFloat(String(newValue))
  if (isNaN(newValueNumber)) {
    employeeBenefit.value.costCapPercentage = "0"
  } else {
    employeeBenefit.value.costCapPercentage = String(round(newValueNumber / 100, 4))
  }
}

const monthlyBenefitCostCapEstimated = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return (
    Number(employeeBenefit.value.grossPayrollMonthlyEstimated) *
    Number(employeeBenefit.value.costCapPercentage)
  )
})

const monthlyBenefitCostCapActual = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return (
    Number(employeeBenefit.value.grossPayrollMonthlyActual) *
    Number(employeeBenefit.value.costCapPercentage)
  )
})

const totalCostEstimated = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return (
    Number(employeeBenefit.value.employeeCostEstimated) +
    Number(employeeBenefit.value.employerCostEstimated)
  )
})

const totalCostActual = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return (
    Number(employeeBenefit.value.employeeCostActual) +
    Number(employeeBenefit.value.employerCostActual)
  )
})

const minimumPaidAmountEstimated = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return Math.min(
    Number(employeeBenefit.value.employerCostEstimated),
    monthlyBenefitCostCapEstimated.value
  )
})

const minimumPaidAmountActual = computed(() => {
  if (isNil(employeeBenefit.value)) {
    return 0
  }

  return Math.min(
    Number(employeeBenefit.value.employerCostActual),
    monthlyBenefitCostCapActual.value
  )
})

function updateEmployeeBenefitCurrencyValue(
  attribute:
    | "grossPayrollMonthlyActual"
    | "grossPayrollMonthlyEstimated"
    | "employeeCostActual"
    | "employeeCostEstimated"
    | "employerCostActual"
    | "employerCostEstimated",
  newValue: string | number | null
) {
  if (isNil(employeeBenefit.value)) {
    return
  }

  if (["-", "", null].includes(newValue as string | null)) {
    employeeBenefit.value[attribute] = "0"
  } else {
    const newValueNumber = parseFloat(String(newValue))
    employeeBenefit.value[attribute] = String(newValueNumber)
  }
}

const snack = useSnack()

async function saveAndNotify() {
  if (isNil(employeeBenefit.value)) return

  try {
    await save()
    snack.success("Employee benefit saved successfully!")
  } catch (error) {
    snack.error(`Failed to save employee benefit: ${error}`)
  }
}
</script>
