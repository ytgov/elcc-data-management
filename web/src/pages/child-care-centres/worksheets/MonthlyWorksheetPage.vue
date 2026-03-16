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

      <BuildingExpensesEditTable
        ref="buildingExpensesEditTable"
        :where="buildingExpenseWhere"
        :hide-actions-column="!isCurrentOrFutureFiscalPeriod"
      />

      <!-- TODO: only show this feature when month is not in the past? -->
      <!-- TODO: maybe move this to a separate component? -->
      <v-row class="mt-4">
        <v-col
          v-if="!showBuildingExpenseCreateForm"
          cols="12"
          class="d-flex justify-end"
        >
          <v-btn
            color="primary"
            @click="showBuildingExpenseCreateForm = true"
          >
            Add Building Expense
          </v-btn>
        </v-col>
        <v-col
          v-else
          cols="12"
        >
          <BuildingExpenseCreateFormCard
            id="building-expense-create-form-card"
            :centre-id="centreId"
            :fiscal-period-id="fiscalPeriodId"
            @created="closeCreateFormAndRefresh"
            @cancel="showBuildingExpenseCreateForm = false"
          />
        </v-col>
      </v-row>
    </section>
    <KeyboardShortcutsModal ref="keyboardShortcutsModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from "vue"
import { isEmpty, isNil, upperFirst } from "lodash"
import { useHotkey } from "vuetify"
import { useRouteQuery } from "@vueuse/router"

import sleepMs from "@/utils/sleep-ms"
import { booleanTransformer } from "@/utils/use-route-query-transformers"
import useFiscalPeriods, { FiscalPeriodMonths } from "@/use/use-fiscal-periods"
import useFundingSubmissionLineJsons from "@/use/use-funding-submission-line-jsons"

import PageLoader from "@/components/common/PageLoader.vue"
import KeyboardShortcutsModal from "@/components/common/KeyboardShortcutsModal.vue"
import FundingSubmissionLineJsonEditSheet from "@/components/funding-submission-line-jsons/FundingSubmissionLineJsonEditSheet.vue"
import BuildingExpenseCreateFormCard from "@/components/building-expenses/BuildingExpenseCreateFormCard.vue"
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

const isCurrentOrFutureFiscalPeriod = computed(() => {
  if (isNil(fiscalPeriod.value)) return false

  return new Date(fiscalPeriod.value.dateEnd) >= new Date()
})

const buildingExpenseWhere = computed(() => ({
  centreId: props.centreId,
  fiscalPeriodId: fiscalPeriodId.value,
}))

const showBuildingExpenseCreateForm = useRouteQuery("showBuildingExpenseCreateForm", "false", {
  transform: booleanTransformer,
})

const keyboardShortcutsModal = useTemplateRef("keyboardShortcutsModal")
const buildingExpensesEditTable = useTemplateRef("buildingExpensesEditTable")

useHotkey("shift+?", showKeyboardShortcutsModal)

watchEffect(async () => {
  if (!showBuildingExpenseCreateForm.value) return

  await sleepMs(50)

  document.getElementById("building-expense-create-form-card")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
})

function showKeyboardShortcutsModal() {
  keyboardShortcutsModal.value?.open()
}

async function closeCreateFormAndRefresh() {
  showBuildingExpenseCreateForm.value = false
  await buildingExpensesEditTable.value?.refresh()
}
</script>
