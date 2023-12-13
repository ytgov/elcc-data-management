<template>
  <v-table>
    <thead>
      <tr>
        <th></th>
        <th class="text-left">Est Total</th>
        <th></th>
        <th class="text-left">Act Total</th>
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
            @update:model-value="updateEmployeeBenefit('grossPayrollMonthlyEstimated', $event)"
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
            @update:model-value="updateEmployeeBenefit('grossPayrollMonthlyActual', $event)"
          />
        </td>
      </tr>
      <tr>
        <td>{{ employeeBenefit.costCapPercentage * 100 }}% of above</td>
        <td>
          <v-text-field
            :model-value="formatMoney(estimatedMonthlyBenefitCostCap)"
            aria-label="Estimated Monthly Benefit Cost Cap"
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
            :model-value="formatMoney(actualMonthlyBenefitCostCap)"
            aria-label="Actual Monthly Benefit Cost Cap"
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
          <v-text-field v-model="employeeBenefit.employeeCostEstimated" />
        </td>
        <td></td>
        <td>
          <v-text-field v-model="employeeBenefit.employeeCostActual" />
        </td>
      </tr>
      <tr>
        <td>Employer Cost</td>
        <td>
          <v-text-field v-model="employeeBenefit.employerCostEstimated" />
        </td>
        <td></td>
        <td>
          <v-text-field v-model="employeeBenefit.employerCostActual" />
        </td>
      </tr>
      <tr>
        <td class="text-uppercase">Section Total</td>
        <td>
          {{
            Math.min(
              employeeBenefit.employeeCostEstimated + employeeBenefit.employerCostEstimated,
              employeeBenefit.grossPayrollMonthlyEstimated * employeeBenefit.costCapPercentage
            )
          }}
        </td>
        <td></td>
        <td>
          {{
            Math.min(
              employeeBenefit.employeeCostActual + employeeBenefit.employerCostActual,
              employeeBenefit.grossPayrollMonthlyActual * employeeBenefit.costCapPercentage
            )
          }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import { isEmpty, isUndefined } from "lodash"

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
const estimatedMonthlyBenefitCostCap = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return (
    employeeBenefit.value.grossPayrollMonthlyEstimated * employeeBenefit.value.costCapPercentage
  )
})
const actualMonthlyBenefitCostCap = computed(() => {
  if (isUndefined(employeeBenefit.value)) return 0

  return employeeBenefit.value.grossPayrollMonthlyActual * employeeBenefit.value.costCapPercentage
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

function updateEmployeeBenefit(
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
</script>
