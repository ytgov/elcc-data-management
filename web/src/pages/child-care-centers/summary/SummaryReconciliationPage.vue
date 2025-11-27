<template>
  <v-skeleton-loader
    v-if="isLoading"
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
          {
            fiscalPeriodId,
            fundingReceivedPeriodAmount,
            eligibleExpensesPeriodAmount,
            payrollAdjustmentsPeriodAmount,
            cumulativeBalanceAmount,
          },
          index
        ) in fundingReconciliationAdjustments"
        :key="`adjustment-${index}`"
      >
        <tr>
          <td class="text-left font-weight-bold">{{ buildLabel(fiscalPeriodId) }}</td>
          <td class="text-right">
            {{ formatMoney(fundingReceivedPeriodAmount) }}
          </td>
          <td class="text-right">
            {{ formatMoney(eligibleExpensesPeriodAmount) }}
          </td>
          <td class="text-right">
            {{ formatMoney(payrollAdjustmentsPeriodAmount) }}
          </td>

          <td class="text-right">
            {{ formatMoney(cumulativeBalanceAmount) }}
          </td>
        </tr>
      </template>
      <tr class="font-weight-bold bg-green-lighten-4">
        <td class="text-left">Totals</td>
        <td class="text-right">
          {{ formatMoney(fundingReconciliation.fundingReceivedTotalAmount) }}
        </td>
        <td class="text-right">
          {{ formatMoney(fundingReconciliation.eligibleExpensesTotalAmount) }}
        </td>
        <td class="text-right">
          {{ formatMoney(fundingReconciliation.payrollAdjustmentsTotalAmount) }}
        </td>
        <td class="text-right">
          {{ formatMoney(fundingReconciliation.finalBalanceAmount) }}
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
import { computed, ref, watch } from "vue"
import { isNil, keyBy, upperFirst } from "lodash"

import { formatMoney } from "@/utils/formatters"
import normalizeFiscalYearToLongForm from "@/utils/normalize-fiscal-year-to-long-form"

import api from "@/api"

import useFiscalPeriods from "@/use/use-fiscal-periods"
import useFundingReconciliations from "@/use/use-funding-reconciliations"
import useFundingReconciliationAdjustments from "@/use/use-funding-reconciliation-adjustments"

const props = defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()

const centerIdAsNumber = computed(() => parseInt(props.centreId))
const fiscalYearLong = computed(() => normalizeFiscalYearToLongForm(props.fiscalYearSlug))

const fundingReconciliationsQuery = computed(() => ({
  filters: {
    byFiscalYearLong: fiscalYearLong.value,
  },
  where: {
    centreId: centerIdAsNumber.value,
  },
  perPage: 1,
}))
const {
  fundingReconciliations,
  isLoading: isLoadingFundingReconciliations,
  refresh: refreshFundingReconciliations,
} = useFundingReconciliations(fundingReconciliationsQuery)

const fundingReconciliation = computed(() => fundingReconciliations.value[0])
const fundingReconciliationId = computed(() => fundingReconciliation.value?.id)

// TODO: mabye just load funding reconciliation, and have it's show serializer load these other objects?

const fundingReconciliationAdjustmentsQuery = computed(() => ({
  where: {
    fundingReconciliationId: fundingReconciliationId.value,
  },
}))
const {
  fundingReconciliationAdjustments,
  isLoading: isLoadingFundingReconciliationAdjustments,
  refresh: refreshFundingReconciliationAdjustments,
} = useFundingReconciliationAdjustments(fundingReconciliationAdjustmentsQuery, {
  skipWatchIf: () => isNil(fundingReconciliationId.value),
})

const fiscalPeriodsQuery = computed(() => ({
  where: {
    fiscalYear: props.fiscalYearSlug,
  },
}))
const { fiscalPeriods, isLoading: isLoadingFiscalPeriods } = useFiscalPeriods(fiscalPeriodsQuery)
const fiscalPeriodsById = computed(() => keyBy(fiscalPeriods.value, "id"))

const isLoading = computed(
  () =>
    isLoadingFundingReconciliations.value ||
    isLoadingFundingReconciliationAdjustments.value ||
    isLoadingFiscalPeriods.value
)

function buildLabel(fiscalPeriodId: number): string {
  const fiscalPeriod = fiscalPeriodsById.value[fiscalPeriodId]
  if (isNil(fiscalPeriod)) return "..."

  const capitalizedMonth = upperFirst(fiscalPeriod.month)
  return `${capitalizedMonth} Expenses`
}

watch(fundingReconciliationId, async (newFundingReconciliationId) => {
  if (isNil(newFundingReconciliationId)) return

  await refreshFundingReconciliation(newFundingReconciliationId)
})

const isRefreshing = ref(false)

async function refreshFundingReconciliation(newFundingReconciliationId: number) {
  isRefreshing.value = true
  try {
    const { fundingReconciliation: refreshedFundingReconciliation } =
      await api.fundingReconciliations.refreshApi.create(newFundingReconciliationId)

    if (refreshedFundingReconciliation.updatedAt !== fundingReconciliation.value.updatedAt) {
      await refreshFundingReconciliations()
      await refreshFundingReconciliationAdjustments()
    }
  } catch (error) {
    console.error(`Failed to refresh funding reconciliation ${newFundingReconciliationId}`, {
      error,
    })
  } finally {
    isRefreshing.value = false
  }
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
