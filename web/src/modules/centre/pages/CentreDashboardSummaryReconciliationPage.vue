<template>
  <v-table class="ma-4">
    <thead>
      <tr>
        <th class="text-left"></th>
        <th class="text-right font-weight-bold">Advance</th>
        <th class="text-right font-weight-bold">Adjustments</th>
        <th class="text-right font-weight-bold">Expenses</th>
        <th class="text-right font-weight-bold">Balance</th>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="(adjustment, adjustmentIndex) in allAdjustments"
        :key="`adjustment-${adjustmentIndex}`"
      >
        <tr :class="rowClasses(adjustmentIndex)">
          <td class="text-left font-weight-bold">{{ adjustment.name }}</td>

          <template v-if="adjustment.type === PAYMENT_TYPE">
            <td class="text-right">{{ formatMoney(centsToDollars(adjustment.amountInCents)) }}</td>
            <td class="text-right"></td>
            <td class="text-right"></td>
          </template>
          <template v-else-if="isExpenseTypeAdjustment(adjustment)">
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="adjustment-cell text-right">
              {{ formatMoney(centsToDollars(adjustment.amountInCents)) }}
              <v-tooltip
                v-if="!isEmpty(adjustment.note)"
                bottom
              >
                <template #activator="{ props }">
                  <sup class="asterisk-icon">
                    <v-icon
                      size="small"
                      v-bind="props"
                      >mdi-asterisk-circle-outline</v-icon
                    >
                  </sup>
                </template>
                <span class="text-white">{{ adjustment.note }}</span>
              </v-tooltip>
            </td>
          </template>

          <td class="text-right">
            {{ formatMoney(centsToDollars(allAdjustmentsRunningTotals[adjustmentIndex])) }}
          </td>
        </tr>
      </template>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">Totals</td>
        <td class="text-right">{{ formatMoney(centsToDollars(paymentsTotal)) }}</td>
        <td class="text-right"></td>
        <td class="text-right">{{ formatMoney(centsToDollars(expensesTotal)) }}</td>
        <td class="text-right">
          {{ formatMoney(centsToDollars(allAdjustmentsRunningTotals[allAdjustments.length - 1])) }}
        </td>
      </tr>
      <tr>
        <td colspan="5"></td>
      </tr>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">Agreement Value</td>
        <td
          class="text-right"
          colspan="2"
        >
          TODO: T00023514
        </td>
        <td
          class="text-right"
          colspan="2"
        >
          Remaining
        </td>
      </tr>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">TODO: $449,420.00</td>
        <td
          class="text-right"
          colspan="2"
        >
          TODO: $184,243.00
        </td>
        <td
          class="text-right"
          colspan="2"
        >
          TODO: $265,177.00
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { isEmpty, isNil, keyBy, mapValues, sumBy } from "lodash"

import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"
import { interleaveArrays } from "@/utils/interleave-arrays"

import employeeBenefitsApi, { EmployeeBenefit } from "@/api/employee-benefits-api"
import employeeWageTiersApi from "@/api/employee-wage-tiers-api"
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import wageEnhancementsApi, { EI_CPP_WCB_RATE } from "@/api/wage-enhancements-api"

import useFundingSubmissionLineJsonsStore from "@/store/funding-submission-line-jsons"
import usePaymentsStore from "@/store/payments"

const PAYMENT_TYPE = "payment"
const EXPENSE_TYPE = "expense"
const DATE_NAMES = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
]

type Expense = {
  dateName: string
  name: string
  amountInCents: number
  note: string
  type: typeof EXPENSE_TYPE
}

const props = defineProps({
  centreId: {
    type: String,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    required: true,
  },
})

const centreIdNumber = computed(() => parseInt(props.centreId))
const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const paymentsStore = usePaymentsStore()
const payments = computed(() => paymentsStore.items)
const fundingSubmissionLineJsonsStore = useFundingSubmissionLineJsonsStore()
const fiscalPeriods = ref<FiscalPeriod[]>([])
const fiscalPeriodIds = computed(() => fiscalPeriods.value.map((fiscalPeriod) => fiscalPeriod.id))
const fiscalPeriodsById = computed(() => keyBy(fiscalPeriods.value, "id"))
const fiscalPeriodsByMonth = computed(() => keyBy(fiscalPeriods.value, "month"))
const employeeBenefits = ref<
  (EmployeeBenefit & {
    fiscalPeriod: FiscalPeriod
  })[]
>([])
const employeeBenefitsByMonth = computed(() => keyBy(employeeBenefits.value, "fiscalPeriod.month"))

const expenses = ref<Expense[]>(
  DATE_NAMES.map((dateName) => ({
    dateName,
    name: `${dateName} Expenses`,
    amountInCents: 0,
    note: "",
    type: EXPENSE_TYPE,
  }))
)

const typedPayments = computed(() =>
  payments.value.map((payment) => ({
    ...payment,
    type: PAYMENT_TYPE,
  }))
)

const allAdjustments = computed(() => {
  return interleaveArrays(typedPayments.value, expenses.value, { chunkSize: 2 })
})

const allAdjustmentsRunningTotals = computed(() => {
  let total = 0
  return allAdjustments.value.map((adjustment) => {
    if (adjustment.type === PAYMENT_TYPE) {
      total += adjustment.amountInCents
    } else if (adjustment.type === EXPENSE_TYPE) {
      total -= adjustment.amountInCents
    }
    return total
  })
})

const paymentsTotal = computed(() => sumBy(payments.value, "amountInCents"))
const expensesTotal = computed(() => sumBy(expenses.value, "amountInCents"))

function isExpenseTypeAdjustment(adjustment: unknown): adjustment is Expense {
  if (typeof adjustment !== "object" || adjustment === null) return false
  if (!("type" in adjustment)) return false

  return adjustment.type === EXPENSE_TYPE
}

onMounted(async () => {
  await paymentsStore.initialize({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })
  await fetchFiscalPeriods()
  await fetchEmployeeBenefits()
  await fundingSubmissionLineJsonsStore.initialize({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })
  if (isEmpty(fundingSubmissionLineJsonsStore.items)) return

  await updateExpenseValues()
})

async function fetchFiscalPeriods() {
  const { fiscalPeriods: newFiscalPeriods } = await fiscalPeriodsApi.list({
    where: {
      fiscalYear: props.fiscalYearSlug,
    },
  })
  fiscalPeriods.value = newFiscalPeriods
}

async function fetchEmployeeBenefits(): Promise<void> {
  const { employeeBenefits: newEmployeeBenefits } = await employeeBenefitsApi.list({
    where: {
      centreId: centreIdNumber.value,
      fiscalPeriodId: fiscalPeriodIds.value,
    },
  })

  employeeBenefits.value = newEmployeeBenefits.map((employeeBenefit) => ({
    ...employeeBenefit,
    fiscalPeriod: fiscalPeriodsById.value[employeeBenefit.fiscalPeriodId],
  }))
}

async function updateExpenseValues() {
  expenses.value.map((expense) => {
    const { dateName } = expense
    const linesForMonth = fundingSubmissionLineJsonsStore.linesForMonth(dateName)

    expense.amountInCents = dollarsToCents(sumBy(linesForMonth, "actualComputedTotal"))

    injectEmployeeBenefitMonthlyCost(expense, dateName.toLowerCase())
    lazyInjectWageEnhancementMonthlyCost(expense, dateName.toLowerCase())
  })
}

/*
  This function injects the estimated paid amount, until the actual paid amount is available.
*/
function injectEmployeeBenefitMonthlyCost(expense: Expense, month: string): void {
  const employeeBenefitForMonth = employeeBenefitsByMonth.value[month]
  if (isNil(employeeBenefitForMonth)) return

  const {
    employerCostEstimated,
    employerCostActual,
    grossPayrollMonthlyEstimated,
    grossPayrollMonthlyActual,
    costCapPercentage,
  } = employeeBenefitForMonth
  const estimatedPaidAmount = Math.min(
    employerCostEstimated,
    grossPayrollMonthlyEstimated * costCapPercentage
  )
  const actualPaidAmount = Math.min(
    employerCostActual,
    grossPayrollMonthlyActual * costCapPercentage
  )
  const isCostActual = actualPaidAmount > 0
  const paidAmountInDollars = isCostActual ? actualPaidAmount : estimatedPaidAmount

  if (!isCostActual) {
    expense.note = "This is an estimated expense."
  }

  expense.amountInCents += dollarsToCents(paidAmountInDollars)
}

/*
  This function injects the estimated total amount, until the actual total amount is available.
*/
async function lazyInjectWageEnhancementMonthlyCost(expense: Expense, month: string) {
  const fiscalPeriod = fiscalPeriodsByMonth.value[month]
  const { employeeWageTiers } = await employeeWageTiersApi.list({
    where: {
      fiscalPeriodId: fiscalPeriod.id,
    },
  })
  const employeeWageTierIds = employeeWageTiers.map((employeeWageTier) => employeeWageTier.id)
  const { wageEnhancements } = await wageEnhancementsApi.list({
    where: {
      centreId: centreIdNumber.value,
      employeeWageTierId: employeeWageTierIds,
    },
  })
  if (isEmpty(wageEnhancements)) return

  const wageRatePerHoursByEmployeeWageTierId = mapValues(
    keyBy(employeeWageTiers, "id"),
    "wageRatePerHour"
  )
  const wageEnhancementsEstimatedSubtotal = wageEnhancements.reduce(
    (total, { hoursEstimated, employeeWageTierId }) => {
      const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId[employeeWageTierId]

      return total + hoursEstimated * wageRatePerHour
    },
    0
  )
  const wageEnhancementsActualSubtotal = wageEnhancements.reduce(
    (total, { hoursActual, employeeWageTierId }) => {
      const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId[employeeWageTierId]

      return total + hoursActual * wageRatePerHour
    },
    0
  )
  const wageEnhancementsEstimatedTotal = wageEnhancementsEstimatedSubtotal * (1 + EI_CPP_WCB_RATE)
  const wageEnhancementsActualTotal = wageEnhancementsActualSubtotal * (1 + EI_CPP_WCB_RATE)

  const isCostActual = wageEnhancementsActualTotal > 0
  const totalInDollars = isCostActual ? wageEnhancementsActualTotal : wageEnhancementsEstimatedTotal

  if (!isCostActual) {
    expense.note = "This is an estimated expense."
  }

  expense.amountInCents += dollarsToCents(totalInDollars)
}

function rowClasses(index: number): string[] {
  const classes = []
  if (index % 2 === 0) {
    classes.push("bg-grey-lighten-3")
  } else {
    classes.push("bg-gray-darken-1")
  }

  return classes
}
</script>

<style scoped>
.adjustment-cell {
  position: relative;
}

.asterisk-icon {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  transform: translate(100%, 0%); /* Position the asterisk outside the content */
}
</style>
