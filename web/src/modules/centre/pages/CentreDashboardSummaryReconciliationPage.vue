<template>
  <v-skeleton-loader
    v-if="isLoading"
    :rows="10"
    :columns="5"
    type="table"
  />
  <v-table
    v-else
    class="ma-4"
  >
    <thead>
      <tr>
        <th class="text-left"></th>
        <th class="text-right font-weight-bold">Advance</th>
        <th class="text-right font-weight-bold">Expenses</th>
        <th class="text-right font-weight-bold">Employees</th>
        <th class="text-right font-weight-bold">Balance</th>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="(
          { label, employee, expense, payment, runningTotal }, adjustmentIndex
        ) in adjustmentRows"
        :key="`adjustment-${adjustmentIndex}`"
      >
        <tr>
          <td class="text-left font-weight-bold">{{ label }}</td>
          <td class="text-right">
            {{ formatMoney(centsToDollars(payment.amountInCents)) }}
          </td>
          <td class="relative text-right">
            {{ formatMoney(centsToDollars(expense.amountInCents)) }}
            <template v-if="expense.includesEstimates">
              <sup class="offset-asterisk-icon">
                <v-icon size="small">mdi-asterisk-circle-outline</v-icon>
              </sup>
              <v-tooltip
                location="bottom"
                activator="parent"
              >
                <span class="text-white">This expense includes estimated values.</span>
              </v-tooltip>
            </template>
          </td>
          <td class="text-right relative">
            {{ formatMoney(centsToDollars(employee.amountInCents)) }}
            <template v-if="employee.includesEstimates">
              <sup class="offset-asterisk-icon">
                <v-icon size="small">mdi-asterisk-circle-outline</v-icon>
              </sup>
              <v-tooltip
                location="bottom"
                activator="parent"
              >
                <span class="text-white">This amount includes estimated values.</span>
              </v-tooltip>
            </template>
          </td>

          <td class="text-right">
            {{ formatMoney(centsToDollars(runningTotal)) }}
          </td>
        </tr>
      </template>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">Totals</td>
        <td class="text-right">{{ formatMoney(centsToDollars(paymentsTotal)) }}</td>
        <td class="text-right">{{ formatMoney(centsToDollars(expensesTotal)) }}</td>
        <td class="text-right">{{ formatMoney(centsToDollars(employeesTotal)) }}</td>
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
import { DateTime, Interval } from "luxon"
import { ref, computed, watch } from "vue"

import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"

import employeeBenefitsApi, { EmployeeBenefit } from "@/api/employee-benefits-api"
import employeeWageTiersApi from "@/api/employee-wage-tiers-api"
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import wageEnhancementsApi, { EI_CPP_WCB_RATE } from "@/api/wage-enhancements-api"

import usePaymentsStore from "@/store/payments"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"

type Adjustment = {
  fiscalPeriodId: number
  amountInCents: number
  includesEstimates: boolean
}

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    required: true,
  },
})

const isLoading = ref(false)
const paymentsStore = usePaymentsStore()
const payments = computed(() => paymentsStore.items)

const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const fundingSubmissionLineJsonsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    fiscalYear: fiscalYear.value,
  },
}))
const { fetch: fetchFundingSubmisionLineJsons, linesForMonth: fundingSubmissionLinesForMonth } =
  useFundingSubmissionLineJsons(fundingSubmissionLineJsonsQuery, {
    skipWatchIf: () => true,
  })

const fiscalPeriods = ref<FiscalPeriod[]>([])
const fiscalPeriodsById = computed(() => keyBy(fiscalPeriods.value, "id"))
const fiscalPeriodsByMonth = computed(() => keyBy(fiscalPeriods.value, "month"))
const employeeBenefits = ref<
  (EmployeeBenefit & {
    fiscalPeriod: FiscalPeriod
  })[]
>([])
const employeeBenefitsByMonth = computed(() => keyBy(employeeBenefits.value, "fiscalPeriod.month"))

const expenses = ref<Adjustment[]>([])
const employees = ref<Adjustment[]>([])

const expensesByFiscalPeriodId = computed(() => keyBy(expenses.value, "fiscalPeriodId"))
const employeesByFiscalPeriodId = computed(() => keyBy(employees.value, "fiscalPeriodId"))
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
      includesEstimates: false,
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
    employee: Adjustment
    payment: Adjustment
    runningTotal: number
  }[]
>(() => {
  let runningTotal = 0
  const rows = fiscalPeriods.value.map((fiscalPeriod) => {
    const monthName = upperFirst(fiscalPeriod.month)
    const paymentsForPeriod = paymentAdujstmentsByFiscalPeriodId.value[fiscalPeriod.id]
    const expensesForPeriod = expensesByFiscalPeriodId.value[fiscalPeriod.id]
    const employeesForPeriod = employeesByFiscalPeriodId.value[fiscalPeriod.id]

    if (isNil(paymentsForPeriod) || isNil(expensesForPeriod)) {
      return null
    }

    runningTotal += paymentsForPeriod.amountInCents
    runningTotal -= expensesForPeriod.amountInCents
    runningTotal -= employeesForPeriod.amountInCents

    return {
      fiscalPeriodId: fiscalPeriod.id,
      label: `${monthName} Expenses`,
      expense: expensesForPeriod,
      employee: employeesForPeriod,
      payment: paymentsForPeriod,
      runningTotal,
    }
  })

  return compact(rows)
})

const paymentsTotal = computed(() => sumBy(payments.value, "amountInCents"))
const expensesTotal = computed(() => sumBy(expenses.value, "amountInCents"))
const employeesTotal = computed(() => sumBy(employees.value, "amountInCents"))
const adjustmentsTotal = computed(
  () => paymentsTotal.value - expensesTotal.value - employeesTotal.value
)

watch<[number, string], true>(
  () => [props.centreId, props.fiscalYearSlug],
  async ([newCentreId, newFiscalYearSlug], _oldValues) => {
    isLoading.value = true

    const newFiscalYear = newFiscalYearSlug.replace("-", "/")

    await paymentsStore.fetch({
      where: {
        centreId: newCentreId,
        fiscalYear: newFiscalYear,
      },
    })
    fiscalPeriods.value = await fetchFiscalPeriods(newFiscalYearSlug)
    const fiscalPeriodIds = fiscalPeriods.value.map((fiscalPeriod) => fiscalPeriod.id)
    await fetchEmployeeBenefits(newCentreId, fiscalPeriodIds)
    await fetchFundingSubmisionLineJsons()
    expenses.value = await buildExpenseValues(fiscalPeriods.value)
    employees.value = await buildEmployeeValues(fiscalPeriods.value)

    isLoading.value = false
  },
  {
    immediate: true,
  }
)

async function fetchFiscalPeriods(fiscalYearSlug: string): Promise<FiscalPeriod[]> {
  const { fiscalPeriods } = await fiscalPeriodsApi.list({
    where: {
      fiscalYear: fiscalYearSlug,
    },
  })
  return fiscalPeriods
}

async function fetchEmployeeBenefits(centreId: number, fiscalPeriodsIds: number[]): Promise<void> {
  const { employeeBenefits: newEmployeeBenefits } = await employeeBenefitsApi.list({
    where: {
      centreId,
      fiscalPeriodId: fiscalPeriodsIds,
    },
  })

  employeeBenefits.value = newEmployeeBenefits.map((employeeBenefit) => ({
    ...employeeBenefit,
    fiscalPeriod: fiscalPeriodsById.value[employeeBenefit.fiscalPeriodId],
  }))
}

async function buildExpenseValues(fiscalPeriods: FiscalPeriod[]): Promise<Adjustment[]> {
  const expensePromises = fiscalPeriods.map(async (fiscalPeriod) => {
    const expense: Adjustment = {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents: 0,
      includesEstimates: false,
    }
    const { month } = fiscalPeriod
    const monthAsDateName = upperFirst(month)
    const linesForMonth = fundingSubmissionLinesForMonth(monthAsDateName)

    if (!isNil(linesForMonth)) {
      const actualSectionsTotal = sumBy(linesForMonth, "actualComputedTotal")
      const estimatedSectionsTotal = sumBy(linesForMonth, "estimatedComputedTotal")

      const includesEstimates = estimatedSectionsTotal > 0 && actualSectionsTotal === 0
      const sectionsTotal = includesEstimates ? estimatedSectionsTotal : actualSectionsTotal

      expense.includesEstimates ||= includesEstimates
      expense.amountInCents += dollarsToCents(sectionsTotal)
    }

    return expense
  })

  return Promise.all(expensePromises)
}

async function buildEmployeeValues(fiscalPeriods: FiscalPeriod[]): Promise<Adjustment[]> {
  const employeePromises = fiscalPeriods.map(async (fiscalPeriod) => {
    const employee: Adjustment = {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents: 0,
      includesEstimates: false,
    }
    const { month } = fiscalPeriod
    const linesForMonth = employeeBenefits.value.find((b) => b.fiscalPeriodId == fiscalPeriod.id)

    if (!isNil(linesForMonth)) {
      if (linesForMonth.grossPayrollMonthlyActual > 0) {
        let actGrossAmount =
          linesForMonth.grossPayrollMonthlyActual * linesForMonth.costCapPercentage
        let actEmployerAmount = linesForMonth.employerCostActual
        employee.amountInCents = dollarsToCents(Math.min(actGrossAmount, actEmployerAmount))
        employee.includesEstimates = false
      } else {
        let estGrossAmount =
          linesForMonth.grossPayrollMonthlyEstimated * linesForMonth.costCapPercentage
        let estEmployerAmount = linesForMonth.employerCostEstimated
        employee.amountInCents = dollarsToCents(Math.min(estGrossAmount, estEmployerAmount))
        employee.includesEstimates = true
      }
    }

    injectEmployeeBenefitMonthlyCost(employee, month)
    await lazyInjectWageEnhancementMonthlyCost(employee, month)

    return employee
  })

  return Promise.all(employeePromises)
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
  const includesEstimates = estimatedPaidAmount > 0 && actualPaidAmount === 0
  const paidAmountInDollars = includesEstimates ? estimatedPaidAmount : actualPaidAmount

  expense.includesEstimates ||= includesEstimates
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
      centreId: props.centreId,
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

  const includesEstimates = wageEnhancementsEstimatedTotal > 0 && wageEnhancementsActualTotal === 0
  const totalInDollars = includesEstimates
    ? wageEnhancementsEstimatedTotal
    : wageEnhancementsActualTotal

  expense.includesEstimates ||= includesEstimates
  expense.amountInCents += dollarsToCents(totalInDollars)
}
</script>

<style scoped>
.relative {
  position: relative;
}

.offset-asterisk-icon {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  transform: translate(100%, 0%); /* Position the asterisk outside the content */
}

::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
