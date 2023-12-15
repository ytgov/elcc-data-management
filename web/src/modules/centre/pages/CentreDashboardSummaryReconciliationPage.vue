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
          <template v-else-if="adjustment.type === EXPENSE_TYPE">
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right">
              {{ formatMoney(centsToDollars(adjustment.amountInCents)) }}
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
import { isEmpty, sumBy } from "lodash"

import useFundingSubmissionLineJsonsStore from "@/store/funding-submission-line-jsons"
import usePaymentsStore from "@/store/payments"
import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"
import { interleaveArrays } from "@/utils/interleave-arrays"

const PAYMENT_TYPE = "payment"
const EXPENSE_TYPE = "expense"

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

const expenses = ref([
  { dateName: "April", name: "April Expenses", amountInCents: 0 },
  { dateName: "May", name: "May Expenses", amountInCents: 0 },
  { dateName: "June", name: "June Expenses", amountInCents: 0 },
  { dateName: "July", name: "July Expenses", amountInCents: 0 },
  { dateName: "August", name: "August Expenses", amountInCents: 0 },
  { dateName: "September", name: "September Expenses", amountInCents: 0 },
  { dateName: "October", name: "October Expenses", amountInCents: 0 },
  { dateName: "November", name: "November Expenses", amountInCents: 0 },
  { dateName: "December", name: "December Expenses", amountInCents: 0 },
  { dateName: "January", name: "January Expenses", amountInCents: 0 },
  { dateName: "February", name: "February Expenses", amountInCents: 0 },
  { dateName: "March", name: "March Expenses", amountInCents: 0 },
])

const typedPayments = computed(() =>
  payments.value.map((payment) => ({
    ...payment,
    type: PAYMENT_TYPE,
  }))
)
const typedExpenses = computed(() =>
  expenses.value.map((expense) => ({
    ...expense,
    type: EXPENSE_TYPE,
  }))
)

const allAdjustments = computed(() => {
  return interleaveArrays(typedPayments.value, typedExpenses.value, { chunkSize: 2 })
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

onMounted(async () => {
  await paymentsStore.initialize({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })
  await fundingSubmissionLineJsonsStore
    .initialize({
      where: {
        centreId: centreIdNumber.value,
        fiscalYear: fiscalYear.value,
      },
    })
    .then((fundingSubmissionLineJsons) => {
      if (isEmpty(fundingSubmissionLineJsons)) return

      updateExpenseValues()
    })
})

function updateExpenseValues() {
  expenses.value.map((expense) => {
    const { dateName } = expense
    const linesForMonth = fundingSubmissionLineJsonsStore.linesForMonth(dateName)

    expense.amountInCents = dollarsToCents(sumBy(linesForMonth, "actualComputedTotal"))
  })
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

<style scoped></style>
