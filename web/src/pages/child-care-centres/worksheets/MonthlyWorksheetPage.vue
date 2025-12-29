<template>
  <PageLoader
    v-if="isLoadingFundingSubmissionLineJsons"
    style="height: calc(100dvh - 14em) !important"
    message="Loading worksheets"
  />
  <v-empty-state
    v-else-if="!isLoadingFundingSubmissionLineJsons && isEmpty(fundingSubmissionLineJsons)"
    class="ma-5"
    headline="No Worksheets Found"
    :title="`There are currently no worksheets for ${fiscalYear}.`"
    text="Contact support, explain the page you were on, and what you were trying to do."
  >
    <template #actions>
      <v-btn
        color="primary"
        href="mailto:help+elcc@icefoganalytics.com"
      >
        Contact Support
      </v-btn>
    </template>
  </v-empty-state>
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

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isEmpty, isNil, upperFirst } from "lodash"
import { useHotkey } from "vuetify"

import useFiscalPeriods, { FiscalPeriodMonths } from "@/use/use-fiscal-periods"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"

import PageLoader from "@/components/common/PageLoader.vue"
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
const { fundingSubmissionLineJsons, isLoading: isLoadingFundingSubmissionLineJsons } =
  useFundingSubmissionLineJsons(fundingSubmissionLineJsonsQuery)

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

const keyboardShortcutsModal = useTemplateRef("keyboardShortcutsModal")

useHotkey("shift+?", showKeyboardShortcutsModal)

function showKeyboardShortcutsModal() {
  keyboardShortcutsModal.value?.open()
}
</script>
