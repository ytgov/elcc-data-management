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
      <v-skeleton-loader
        v-if="adjustmentRows.length === 0"
        :loading="true"
        :rows="10"
        :columns="5"
        type="table"
      />
      <template
        v-for="({ label, expense, payment, runningTotal }, adjustmentIndex) in adjustmentRows"
        :key="`adjustment-${adjustmentIndex}`"
      >
        <tr :class="rowClasses(adjustmentIndex)">
          <td class="text-left font-weight-bold">{{ label }}</td>
          <td class="text-right">
            {{ formatMoney(centsToDollars(payment.amountInCents)) }}
          </td>
          <td class="text-right"></td>
          <td class="adjustment-cell text-right">
            {{ formatMoney(centsToDollars(expense.amountInCents)) }}
            <v-tooltip
              v-if="!isEmpty(expense.note)"
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
              <span class="text-white">{{ expense.note }}</span>
            </v-tooltip>
          </td>

          <td class="text-right">
            {{ formatMoney(centsToDollars(runningTotal)) }}
          </td>
        </tr>
      </template>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">Totals</td>
        <td class="text-right">{{ formatMoney(centsToDollars(paymentsTotal)) }}</td>
        <td class="text-right"></td>
        <td class="text-right">{{ formatMoney(centsToDollars(expensesTotal)) }}</td>
        <td class="text-right">
          {{ formatMoney(centsToDollars(adjustmentsTotal)) }}
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
import { compact, isEmpty, isNil, keyBy, mapValues, sumBy, upperFirst } from "lodash"
import { ref, computed, onMounted } from "vue"
import { DateTime, Interval } from "luxon"

import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"

import employeeBenefitsApi, { EmployeeBenefit } from "@/api/employee-benefits-api"
import employeeWageTiersApi from "@/api/employee-wage-tiers-api"
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import wageEnhancementsApi, { EI_CPP_WCB_RATE } from "@/api/wage-enhancements-api"

import useFundingSubmissionLineJsonsStore from "@/store/funding-submission-line-jsons"
import usePaymentsStore from "@/store/payments"

type Adjustment = {
  fiscalPeriodId: number
  amountInCents: number
  note: string
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

const expenses = ref<Adjustment[]>([])
const expensesByFiscalPeriodId = computed(() => keyBy(expenses.value, "fiscalPeriodId"))
const paymentAdujstments = computed<Adjustment[]>(() => {
  return fiscalPeriods.value.map((fiscalPeriod) => {
    const fiscalPeriodInterval = Interval.fromDateTimes(
      fiscalPeriod.dateStart,
      fiscalPeriod.dateEnd
    )
    // TODO: update data model so payments have a fiscal period id
    const paymentsForPeriod = payments.value.filter((payment) => {
      const paidOn = DateTime.fromFormat(payment.paidOn, "yyyy-MM-dd")
      return fiscalPeriodInterval.contains(paidOn)
    })

    const amountInCents = sumBy(paymentsForPeriod, "amountInCents")

    return {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents,
      note: "",
    }
  })
})
const paymentAdujstmentsByFiscalPeriodId = computed(() =>
  keyBy(paymentAdujstments.value, "fiscalPeriodId")
)

const adjustmentRows = computed<
  {
    fiscalPeriodId: number
    label: string
    expense: Adjustment
    payment: Adjustment
    runningTotal: number
  }[]
>(() => {
  let runningTotal = 0
  const rows = fiscalPeriods.value.map((fiscalPeriod) => {
    const monthName = upperFirst(fiscalPeriod.month)
    const paymentsForPeriod = paymentAdujstmentsByFiscalPeriodId.value[fiscalPeriod.id]
    const expensesForPeriod = expensesByFiscalPeriodId.value[fiscalPeriod.id]

    if (isNil(paymentsForPeriod) || isNil(expensesForPeriod)) {
      return null
    }

    runningTotal += paymentsForPeriod.amountInCents
    runningTotal -= expensesForPeriod.amountInCents

    return {
      fiscalPeriodId: fiscalPeriod.id,
      label: `${monthName} Expenses`,
      expense: expensesForPeriod,
      payment: paymentsForPeriod,
      runningTotal,
    }
  })

  return compact(rows)
})

const paymentsTotal = computed(() => sumBy(payments.value, "amountInCents"))
const expensesTotal = computed(() => sumBy(expenses.value, "amountInCents"))
const adjustmentsTotal = computed(() => paymentsTotal.value - expensesTotal.value)

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

  expenses.value = await buildExpenseValues(fiscalPeriods.value)
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

async function buildExpenseValues(fiscalPeriods: FiscalPeriod[]): Promise<Adjustment[]> {
  const expensePromises = fiscalPeriods.map(async (fiscalPeriod) => {
    const { month } = fiscalPeriod
    const monthAsDateName = upperFirst(month)
    const linesForMonth = fundingSubmissionLineJsonsStore.linesForMonth(monthAsDateName)

    const expense = {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents: 0,
      note: "",
    }
    expense.amountInCents = dollarsToCents(sumBy(linesForMonth, "actualComputedTotal"))

    injectEmployeeBenefitMonthlyCost(expense, month)
    await lazyInjectWageEnhancementMonthlyCost(expense, month)

    return expense
  })

  return Promise.all(expensePromises)
}

/*
  This function injects the estimated paid amount, until the actual paid amount is available.
*/
function injectEmployeeBenefitMonthlyCost(expense: Adjustment, month: string): void {
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
async function lazyInjectWageEnhancementMonthlyCost(expense: Adjustment, month: string) {
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
