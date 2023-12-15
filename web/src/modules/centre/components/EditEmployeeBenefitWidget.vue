<template>
  <v-table>
    <thead>
      <tr>
        <th></th>
        <th class="text-left">Est. Total</th>
        <th></th>
        <th class="text-left">Act. Total</th>
      </tr>
    </thead>
    <tbody v-if="employeeBenefit !== undefined">
      <tr>
        <td>Gross Payroll</td>
        <td>
          <CurrencyInput
            :model-value="employeeBenefit.grossPayrollMonthlyEstimated"
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
            :model-value="employeeBenefit.grossPayrollMonthlyActual"
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
            :model-value="employeeBenefit.employeeCostEstimated"
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
            :model-value="employeeBenefit.employeeCostActual"
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
            :model-value="employeeBenefit.employerCostEstimated"
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
            :model-value="employeeBenefit.employerCostActual"
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
        <td class="text-uppercase d-flex align-center">
          Section Total
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-icon
                class="ml-1"
                v-bind="props"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="text-white">
              Totaling the lesser of either {{ costCapPercentage }}% of Gross Payroll or Employee
              Cost plus Employer Cost
            </span>
          </v-tooltip>
        </td>
        <td>
          <v-text-field
            :model-value="formatMoney(minimumTotalCostEstimated)"
            aria-label="Minimum Total Cost Estimated"
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
            :model-value="formatMoney(minimumTotalCostActual)"
            aria-label="Minimum Total Cost Actual"
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
            @click="save"
          >
            Save
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { isEmpty, isUndefined, round } from "lodash"

import employeeBenefitsApi, { type EmployeeBenefit } from "@/api/employee-benefits-api"
import { useNotificationStore } from "@/store/NotificationStore"
import { formatMoney } from "@/utils/format-money"

import CurrencyInput from "@/components/CurrencyInput.vue"

type NonPersistedEmployeeBenefit = Omit<EmployeeBenefit, "id" | "createdAt" | "updatedAt">

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

const employeeBenefit = ref<EmployeeBenefit | NonPersistedEmployeeBenefit>()
const isLoading = ref(true)
const isEditingCostCapPercentage = ref(false)

// NOTE: if you type 8.215, it will round to 8.22
// successive presses of 5 or higher will continue increasing the value
const costCapPercentage = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return round(employeeBenefit.value.costCapPercentage * 100, 2)
})
function updateCostCapPercentage(newValue: any) {
  if (isUndefined(employeeBenefit.value)) return

  const newValueNumber = parseFloat(newValue)
  if (isNaN(newValueNumber)) {
    employeeBenefit.value.costCapPercentage = 0
  } else {
    employeeBenefit.value.costCapPercentage = round(newValueNumber / 100, 4)
  }
}

const monthlyBenefitCostCapEstimated = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return (
    employeeBenefit.value.grossPayrollMonthlyEstimated * employeeBenefit.value.costCapPercentage
  )
})
const monthlyBenefitCostCapActual = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return employeeBenefit.value.grossPayrollMonthlyActual * employeeBenefit.value.costCapPercentage
})
const minimumTotalCostEstimated = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return Math.min(
    employeeBenefit.value.employeeCostEstimated + employeeBenefit.value.employerCostEstimated,
    monthlyBenefitCostCapEstimated.value
  )
})
const minimumTotalCostActual = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return Math.min(
    employeeBenefit.value.employeeCostActual + employeeBenefit.value.employerCostActual,
    monthlyBenefitCostCapActual.value
  )
})

function buildEmployeeBenefit(attributes: Partial<EmployeeBenefit>): NonPersistedEmployeeBenefit {
  return {
    centreId: props.centreId,
    fiscalPeriodId: props.fiscalPeriodId,
    grossPayrollMonthlyActual: 0,
    grossPayrollMonthlyEstimated: 0,
    costCapPercentage: 0.08,
    employeeCostActual: 0,
    employeeCostEstimated: 0,
    employerCostActual: 0,
    employerCostEstimated: 0,
    ...attributes,
  }
}

async function fetchEmployeeBenefit(centreId: number, fiscalPeriodId: number) {
  isLoading.value = false
  try {
    const { employeeBenefits } = await employeeBenefitsApi.list({
      where: {
        centreId,
        fiscalPeriodId,
      },
    })

    if (isEmpty(employeeBenefits)) {
      employeeBenefit.value = buildEmployeeBenefit({ centreId, fiscalPeriodId })
      return
    } else if (employeeBenefits.length > 1) {
      throw new Error(`Multiple employ benefits found for ${centreId} ${fiscalPeriodId}`)
    }

    employeeBenefit.value = employeeBenefits[0]
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to fetch employee benefit: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}

watch<[number, number], true>(
  () => [props.centreId, props.fiscalPeriodId],
  async ([cenreId, fiscalPeriodId], _oldValues) => {
    await fetchEmployeeBenefit(cenreId, fiscalPeriodId)
  },
  { immediate: true }
)

function updateEmployeeBenefitCurrencyValue(
  attribute: keyof (EmployeeBenefit | NonPersistedEmployeeBenefit),
  newValue: any
) {
  if (isUndefined(employeeBenefit.value)) return

  if (["-", "", null].includes(newValue)) {
    employeeBenefit.value[attribute] = 0
  } else {
    const newValueNumber = parseFloat(newValue)
    employeeBenefit.value[attribute] = newValueNumber
  }
}

function isPersisted(
  employeeBenefit: EmployeeBenefit | NonPersistedEmployeeBenefit
): employeeBenefit is EmployeeBenefit {
  return "id" in employeeBenefit && !isUndefined(employeeBenefit.id)
}

async function save() {
  if (isUndefined(employeeBenefit.value)) return

  if (isPersisted(employeeBenefit.value)) {
    await update(employeeBenefit.value.id, employeeBenefit.value)
  } else {
    await create(employeeBenefit.value)
  }
}

async function update(employeeBenefitId: number, employeeBenefitAttributes: EmployeeBenefit) {
  isLoading.value = true
  try {
    const { employeeBenefit: newEmployeeBenefit } = await employeeBenefitsApi.update(
      employeeBenefitId,
      employeeBenefitAttributes
    )

    employeeBenefit.value = newEmployeeBenefit
    notificationStore.notify({
      text: "Employee benefit saved",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to save employee benefit: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}

async function create(employeeBenefitAttributes: NonPersistedEmployeeBenefit) {
  isLoading.value = true
  try {
    const { employeeBenefit: newEmployeeBenefit } =
      await employeeBenefitsApi.create(employeeBenefitAttributes)

    employeeBenefit.value = newEmployeeBenefit
    notificationStore.notify({
      text: "Employee benefit created",
      variant: "success",
    })
  } catch (error) {
    console.error(error)
    notificationStore.notify({
      text: `Failed to create employee benefit: ${error}`,
      variant: "error",
    })
  } finally {
    isLoading.value = false
  }
}
</script>
