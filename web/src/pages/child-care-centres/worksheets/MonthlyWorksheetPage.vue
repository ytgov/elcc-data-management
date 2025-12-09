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
    <section
      v-else
      class="ma-4 mt-8"
    >
      <h3
        class="d-flex justify-space-between align-center mt-4 mb-2 ml-n2 pa-2 rounded bg-primary-lighten-2"
      >
        Building Expenses

        <v-icon
          title="Show keyboard shortcuts"
          class="included"
          @click="showKeyboardShortcutsModal"
        >
          mdi-keyboard
        </v-icon>
      </h3>

      <BuildingExpensesEditTable :where="buildingExpenseWhere" />
    </section>
    <KeyboardShortcutsModal ref="keyboardShortcutsModal" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue"
import { isEmpty, isNil, upperFirst } from "lodash"
import { useHotkey } from "vuetify"

import api from "@/api"
import useFiscalPeriods, { FiscalPeriodMonths } from "@/use/use-fiscal-periods"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"
import useSnack from "@/use/use-snack"

import KeyboardShortcutsModal from "@/components/common/KeyboardShortcutsModal.vue"
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
const fundingPeriodId = computed(() => fiscalPeriod.value?.fundingPeriodId)

const buildingExpenseWhere = computed(() => ({
  centreId: props.centreId,
  fiscalPeriodId: fiscalPeriodId.value,
}))

const isInitializing = ref(false)
const snack = useSnack()

async function initializeWorksheetsForFiscalYear() {
  if (isNil(fundingPeriodId.value)) {
    throw new Error("Could not determine funding period id.")
  }

  isInitializing.value = true
  try {
    await api.centres.fundingPeriods.ensureDependenciesApi.create(
      props.centreId,
      fundingPeriodId.value
    )
    snack.success("Worksheets initialized for fiscal year!")
    await refreshFundingSubmissionLineJsons()
  } catch (error) {
    console.error("Failed to initialize worksheets for fiscal year:", error)
    snack.error(`Failed to initialize worksheets: ${error}`)
  } finally {
    isInitializing.value = false
  }
}

const keyboardShortcutsModal = useTemplateRef("keyboardShortcutsModal")

useHotkey("shift+?", showKeyboardShortcutsModal)

function showKeyboardShortcutsModal() {
  keyboardShortcutsModal.value?.open()
}
</script>
