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
          { label, employeeAdjustment, expense, payment, runningTotal }, adjustmentIndex
        ) in adjustmentRows"
        :key="`adjustment-${adjustmentIndex}`"
      >
        <tr>
          <td class="text-left font-weight-bold">{{ label }}</td>
          <td class="text-right">
            {{ formatMoney(centsToDollars(payment.amountInCents)) }}
          </td>
          <td class="text-right">
            {{ formatMoney(centsToDollars(expense.amountInCents)) }}
          </td>
          <td class="text-right">
            {{ formatMoney(centsToDollars(employeeAdjustment.amountInCents)) }}
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
import { compact, groupBy, isEmpty, isNil, keyBy, mapValues, sumBy, upperFirst } from "lodash"
import { ref, computed, watch } from "vue"

import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"

import employeeBenefitsApi, { EmployeeBenefit } from "@/api/employee-benefits-api"
import employeeWageTiersApi from "@/api/employee-wage-tiers-api"
import fiscalPeriodsApi, { FiscalPeriod } from "@/api/fiscal-periods-api"
import wageEnhancementsApi, { EI_CPP_WCB_RATE } from "@/api/wage-enhancements-api"

import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"
import usePayments from "@/use/use-payments"

type Adjustment = {
  fiscalPeriodId: number
  amountInCents: number
}

const props = defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()

const centerIdAsNumber = computed(() => parseInt(props.centreId))
const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))

const isLoading = ref(false)

const paymentsQuery = computed(() => ({
  where: {
    centreId: centerIdAsNumber.value,
    fiscalYear: fiscalYear.value,
  },
}))
const { payments, fetch: fetchPayments } = usePayments(paymentsQuery, {
  skipWatchIf: () => true,
})

const fundingSubmissionLineJsonsQuery = computed(() => ({
  where: {
    centreId: centerIdAsNumber.value,
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
const employeeAdjustments = ref<Adjustment[]>([])

const expensesByFiscalPeriodId = computed(() => keyBy(expenses.value, "fiscalPeriodId"))
const employeeAdjustmentsByFiscalPeriodId = computed(() =>
  keyBy(employeeAdjustments.value, "fiscalPeriodId")
)
const paymentsByFiscalPeriodId = computed<Record<number, Adjustment[]>>(() =>
  groupBy(payments.value, "fiscalPeriodId")
)
const paymentAdjustments = computed<Adjustment[]>(() => {
  return fiscalPeriods.value.map((fiscalPeriod) => {
    const paymentsForPeriod = paymentsByFiscalPeriodId.value[fiscalPeriod.id] || []
    const amountInCents = sumBy(paymentsForPeriod, "amountInCents")

    return {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents,
    }
  })
})
const paymentAdujstmentsByFiscalPeriodId = computed(() =>
  keyBy(paymentAdjustments.value, "fiscalPeriodId")
)

const adjustmentRows = computed<
  {
    fiscalPeriodId: number
    label: string
    expense: Adjustment
    employeeAdjustment: Adjustment
    payment: Adjustment
    runningTotal: number
  }[]
>(() => {
  let runningTotal = 0
  const rows = fiscalPeriods.value.map((fiscalPeriod) => {
    const monthName = upperFirst(fiscalPeriod.month)
    const paymentsForPeriod = paymentAdujstmentsByFiscalPeriodId.value[fiscalPeriod.id]
    const expensesForPeriod = expensesByFiscalPeriodId.value[fiscalPeriod.id]
    const employeeAdjustmentsForPeriod = employeeAdjustmentsByFiscalPeriodId.value[fiscalPeriod.id]

    if (isNil(paymentsForPeriod) || isNil(expensesForPeriod)) {
      return null
    }

    runningTotal += paymentsForPeriod.amountInCents
    runningTotal -= expensesForPeriod.amountInCents
    runningTotal -= employeeAdjustmentsForPeriod.amountInCents

    return {
      fiscalPeriodId: fiscalPeriod.id,
      label: `${monthName} Expenses`,
      expense: expensesForPeriod,
      employeeAdjustment: employeeAdjustmentsForPeriod,
      payment: paymentsForPeriod,
      runningTotal,
    }
  })

  return compact(rows)
})

const paymentsTotal = computed(() => sumBy(payments.value, "amountInCents"))
const expensesTotal = computed(() => sumBy(expenses.value, "amountInCents"))
const employeesTotal = computed(() => sumBy(employeeAdjustments.value, "amountInCents"))
const adjustmentsTotal = computed(
  () => paymentsTotal.value - expensesTotal.value - employeesTotal.value
)

watch<[number, string], true>(
  () => [centerIdAsNumber.value, props.fiscalYearSlug],
  async ([newCentreId, newFiscalYearSlug], _oldValues) => {
    isLoading.value = true

    await fetchPayments()
    fiscalPeriods.value = await fetchFiscalPeriods(newFiscalYearSlug)
    const fiscalPeriodIds = fiscalPeriods.value.map((fiscalPeriod) => fiscalPeriod.id)
    await fetchEmployeeBenefits(newCentreId, fiscalPeriodIds)
    await fetchFundingSubmisionLineJsons()
    expenses.value = buildExpenseValues(fiscalPeriods.value)
    employeeAdjustments.value = await buildEmployeeAdjustments(fiscalPeriods.value)

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

function buildExpenseValues(fiscalPeriods: FiscalPeriod[]): Adjustment[] {
  const expenseValues = fiscalPeriods.map((fiscalPeriod) => {
    const expense: Adjustment = {
      fiscalPeriodId: fiscalPeriod.id,
      amountInCents: 0,
    }
    const { month } = fiscalPeriod
    const monthAsDateName = upperFirst(month)
    const linesForMonth = fundingSubmissionLinesForMonth(monthAsDateName)

    if (!isNil(linesForMonth)) {
      const actualSectionsTotal = sumBy(linesForMonth, "actualComputedTotal")

      expense.amountInCents += dollarsToCents(actualSectionsTotal)
    }

    return expense
  })

  return expenseValues
}

async function buildEmployeeAdjustments(fiscalPeriods: FiscalPeriod[]): Promise<Adjustment[]> {
  const employeeAdjustmentsPromises = fiscalPeriods.map<Promise<Adjustment>>(
    async (fiscalPeriod) => {
      const { month } = fiscalPeriod

      const employeeBenefitForMonth = employeeBenefitsByMonth.value[month]
      const employeeBenefitCost = calculateEmployeeBenefitCost(employeeBenefitForMonth)

      const fiscalPeriodForMonth = fiscalPeriodsByMonth.value[month]
      const wageEnhancementCost = await calculateWageEnhancementCost(fiscalPeriodForMonth.id)

      return {
        fiscalPeriodId: fiscalPeriod.id,
        amountInCents: employeeBenefitCost + wageEnhancementCost,
      }
    }
  )

  return Promise.all(employeeAdjustmentsPromises)
}

function calculateEmployeeBenefitCost(employeeBenefit: EmployeeBenefit | null): number {
  if (isNil(employeeBenefit)) return 0

  const { employerCostActual, grossPayrollMonthlyActual, costCapPercentage } = employeeBenefit
  const actualPaidAmount = Math.min(
    Number(employerCostActual),
    Number(grossPayrollMonthlyActual) * Number(costCapPercentage)
  )
  return dollarsToCents(actualPaidAmount)
}

async function calculateWageEnhancementCost(fiscalPeriodId: number): Promise<number> {
  const { employeeWageTiers } = await employeeWageTiersApi.list({
    where: {
      fiscalPeriodId,
    },
  })
  const employeeWageTierIds = employeeWageTiers.map((employeeWageTier) => employeeWageTier.id)
  const { wageEnhancements } = await wageEnhancementsApi.list({
    where: {
      centreId: centerIdAsNumber.value,
      employeeWageTierId: employeeWageTierIds,
    },
  })
  if (isEmpty(wageEnhancements)) return 0

  const wageRatePerHoursByEmployeeWageTierId = mapValues(
    keyBy(employeeWageTiers, "id"),
    "wageRatePerHour"
  )

  const wageEnhancementsActualSubtotal = wageEnhancements.reduce(
    (total, { hoursActual, employeeWageTierId }) => {
      const wageRatePerHour = wageRatePerHoursByEmployeeWageTierId[employeeWageTierId]
      return total + hoursActual * wageRatePerHour
    },
    0
  )
  const wageEnhancementsActualTotal = wageEnhancementsActualSubtotal * (1 + EI_CPP_WCB_RATE)

  return dollarsToCents(wageEnhancementsActualTotal)
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
