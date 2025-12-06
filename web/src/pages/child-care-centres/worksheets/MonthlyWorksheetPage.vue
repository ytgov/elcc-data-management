<template>
  <div
    v-if="isLoadingFundingSubmissionLineJsons"
    class="d-flex justify-center mt-10"
  >
    <v-progress-circular indeterminate />
  </div>
  <div
    v-else-if="!isLoadingFundingSubmissionLineJsons && isEmpty(fundingSubmissionLineJsons)"
    class="ma-5"
  >
    <p>There are currently no worksheets for {{ fiscalYear }}.</p>
    <v-btn
      color="primary"
      size="small"
      class="mt-3"
      :loading="isInitializing"
      @click="initializeWorksheetsForFiscalYear"
      >Add worksheets for {{ fiscalYear }}</v-btn
    >
  </div>
  <div v-else>
    <FundingSubmissionLineJsonEditSheet
      :funding-submission-line-json-id="fundingSubmissionLineJsonId"
      class="ma-4"
      @update:funding-submission-line-json="emit('update:fundingSubmissionLineJson', $event)"
    />

    <v-skeleton-loader
      v-if="isNil(fiscalPeriodId)"
      type="table"
    />
    <div
      v-else
      class="ma-4 mt-8"
    >
      <h3 class="section-header">Building Expenses</h3>

      <BuildingExpensesEditTable :where="buildingExpenseWhere" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { isEmpty, isNil, upperFirst } from "lodash"

import centresApi from "@/api/centres-api"
import useFiscalPeriods, { FiscalPeriodMonths } from "@/use/use-fiscal-periods"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"
import useSnack from "@/use/use-snack"

import FundingSubmissionLineJsonEditSheet from "@/components/funding-submission-line-jsons/FundingSubmissionLineJsonEditSheet.vue"
import BuildingExpensesEditTable from "@/components/building-expenses/BuildingExpensesEditTable.vue"

const props = defineProps<{
  centreId: number
  fiscalYearSlug: string
  month: FiscalPeriodMonths
}>()

const emit = defineEmits<{
  "update:fundingSubmissionLineJson": [fundingSubmissionLineJsonId: number]
}>()

const fiscalYear = computed(() => props.fiscalYearSlug.replace("-", "/"))
const monthAsDateName = computed(() => upperFirst(props.month))
const fundingSubmissionLineJsonsQuery = computed(() => ({
  where: {
    centreId: props.centreId,
    fiscalYear: fiscalYear.value,
    dateName: monthAsDateName.value,
  },
  perPage: 1,
}))
const {
  fundingSubmissionLineJsons,
  isLoading: isLoadingFundingSubmissionLineJsons,
  refresh: refreshFundingSubmissionLineJsons,
} = useFundingSubmissionLineJsons(fundingSubmissionLineJsonsQuery)

const fundingSubmissionLineJson = computed(() => fundingSubmissionLineJsons.value[0])
const fundingSubmissionLineJsonId = computed(() => fundingSubmissionLineJson.value?.id)

const fiscalPeriodsQuery = computed(() => {
  return {
    where: {
      fiscalYear: props.fiscalYearSlug,
      month: props.month,
    },
    perPage: 1,
  }
})

const { fiscalPeriods } = useFiscalPeriods(fiscalPeriodsQuery)
const fiscalPeriod = computed(() => fiscalPeriods.value[0])
const fiscalPeriodId = computed(() => fiscalPeriod.value?.id)

const buildingExpenseWhere = computed(() => ({
  centreId: props.centreId,
  fiscalPeriodId: fiscalPeriodId.value,
}))

const isInitializing = ref(false)
const snack = useSnack()

async function initializeWorksheetsForFiscalYear() {
  isInitializing.value = true
  try {
    await centresApi.fiscalYear.create(props.centreId, fiscalYear.value)
    snack.success("Fiscal year added!")
    await refreshFundingSubmissionLineJsons()
  } finally {
    isInitializing.value = false
  }
}
</script>

<style scoped>
.section-header {
  margin-top: 16px;
  margin-bottom: 8px;
  margin-left: -8px;
  padding: 8px;
  font-weight: 400;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 4px;
}
</style>
