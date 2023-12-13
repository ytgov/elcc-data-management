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
          <v-text-field v-model="employeeBenefit.grossPayrollMonthlyEstimated" />
        </td>
        <td></td>
        <td>
          <v-text-field v-model="employeeBenefit.grossPayrollMonthlyActual" />
        </td>
      </tr>
      <tr>
        <td>8% of above</td>
        <td>
          {{ employeeBenefit.grossPayrollMonthlyEstimated * employeeBenefit.costCapPercentage }}
        </td>
        <td></td>
        <td>
          {{ employeeBenefit.grossPayrollMonthlyActual * employeeBenefit.costCapPercentage }}
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
import { ref } from "vue"

type EmployeeBenefit = {
  id: number
  centreId: number
  fislcalPeriodId: number
  grossPayrollMonthlyActual: number
  grossPayrollMonthlyEstimated: number
  costCapPercentage: number
  employeeCostActual: number
  employeeCostEstimated: number
  employerCostActual: number
  employerCostEstimated: number
  createdAt: Date
  updatedAt: Date
}

defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalPeriodId: {
    type: Number,
    required: true,
  },
})

const fakeDate = {
  id: 979,
  centreId: 33,
  fislcalPeriodId: 12,
  grossPayrollMonthlyActual: 6466,
  grossPayrollMonthlyEstimated: 4015,
  costCapPercentage: 0.08,
  employeeCostActual: 2622,
  employeeCostEstimated: 2512,
  employerCostActual: 9594,
  employerCostEstimated: 18877,
  createdAt: new Date("2023-01-27T00:00:00.000Z"),
  updatedAt: new Date("2021-05-15T00:00:00.000Z"),
}
const employeeBenefit = ref<EmployeeBenefit>(fakeDate)
const isLoading = ref(true)

// TODO: other stuff
isLoading.value = false
</script>
