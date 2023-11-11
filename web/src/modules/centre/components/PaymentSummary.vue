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
        <tr>
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
        <td class="text-right"></td>
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
import { isNil, sumBy } from "lodash"

import fundingSubmissionLineJsonsApi, {
  type FundingSubmissionLineJson,
} from "@/api/funding-submission-line-jsons-api"
import usePaymentsStore from "@/store/payments"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"
import { formatMoney, centsToDollars, dollarsToCents } from "@/utils/format-money"
import { interleaveArrays } from "@/utils/interleave-arrays"

const PAYMENT_TYPE = "payment"
const EXPENSE_TYPE = "expense"

const props = defineProps({
  centreId: {
    type: String,
    required: true,
  },
  // fiscalYear: { // TODO: support fical year as prop
  //   type: String,
  //   required: true,
  // },
})

const centreIdNumber = computed(() => parseInt(props.centreId))
const submissionLinesStore = useSubmissionLinesStore()
const fiscalYear = computed(() => submissionLinesStore.currentFiscalYear)
const paymentsStore = usePaymentsStore()
const payments = computed(() => paymentsStore.items)

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
  await submissionLinesStore.initialize() // TODO: push this to a higher plane
  await paymentsStore.initialize({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })
  const { fundingSubmissionLineJsons } = await fundingSubmissionLineJsonsApi.list({
    where: {
      centreId: centreIdNumber.value,
      fiscalYear: fiscalYear.value,
    },
  })

  updateExpenseValues(fundingSubmissionLineJsons)
})

function updateExpenseValues(fundingSubmissionLineJsons: FundingSubmissionLineJson[]) {
  expenses.value.map((expense) => {
    const { dateName } = expense
    const fundingSubmissionLineJsonsForMonth = fundingSubmissionLineJsons.find(
      (fundingSubmissionLineJson) => fundingSubmissionLineJson.dateName === dateName
    )

    if (isNil(fundingSubmissionLineJsonsForMonth)) {
      console.error(`Could not find funding submission line json for month ${dateName}`)
      return
    }

    const { lines: linesForMonth } = fundingSubmissionLineJsonsForMonth
    expense.amountInCents = dollarsToCents(sumBy(linesForMonth, "actualComputedTotal"))
  })
}
</script>

<style scoped>
.total-row {
  background-color: #7a9a0199;
}
</style>
