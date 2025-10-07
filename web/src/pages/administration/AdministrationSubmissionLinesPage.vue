<template>
  <BaseCard show-header>
    <template #left>
      <v-select
        v-model="fiscalYear"
        :items="fiscalYears"
        label="Fiscal year"
        single-line
        style="width: 100px"
        hide-details
        density="compact"
      />

      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"
      />
    </template>
    <template #right>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        @click="openNewFiscalYearDialog"
        >New Fiscal Year</v-btn
      >
    </template>

    <v-data-table-server
      :headers="headers"
      :items="fundingSubmissionLines"
      :loading="isLoading"
      :items-length="totalCount"
      density="compact"
      class="row-clickable"
      @click:row="
        (_event: Event, row: FundingSubmissionLineTableRow) =>
          openFundingSubmissionLineEditDialog(row.item.id)
      "
    >
    </v-data-table-server>
    <FundingSubmissionLineEditorDialog ref="fundingSubmissionLineEditorRef" />
  </BaseCard>
</template>
<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue"
import { uniq } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingSubmissionLines, {
  type FundingSubmissionLineAsIndex,
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

import BaseCard from "@/components/BaseCard.vue"
import FundingSubmissionLineEditorDialog from "@/components/funding-submission-lines/FundingSubmissionLineEditorDialog.vue"

const headers = ref([
  { title: "Section", key: "sectionName" },
  { title: "Line", key: "lineName" },
  { title: "Age Range", key: "ageRange" },
  { title: "Monthly Amount", key: "monthlyAmountDisplay" },
])

const search = ref("")
const page = ref(1)
const perPage = ref(10)
const fiscalYear = ref<string | null>(null)

const fundingSubmissionLinesWhere = computed(() => {
  const where: FundingSubmissionLineWhereOptions = {}

  if (fiscalYear.value) {
    where.fiscalYear = fiscalYear.value
  }

  return where
})

const fundingSubmissionLinesFilters = computed(() => {
  const filters: FundingSubmissionLineFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

const fundingSubmissionLinesQuery = computed(() => ({
  where: fundingSubmissionLinesWhere.value,
  filters: fundingSubmissionLinesFilters.value,
  page: page.value,
  perPage: perPage.value,
}))

const { fundingSubmissionLines, totalCount, isLoading } = useFundingSubmissionLines(
  fundingSubmissionLinesQuery
)

const fiscalYears = computed(() => {
  return uniq(fundingSubmissionLines.value.map((line) => line.fiscalYear))
    .sort()
    .reverse()
})

function openNewFiscalYearDialog() {
  alert("TODO: implement new fiscal year creation")
}

type FundingSubmissionLineTableRow = {
  item: FundingSubmissionLineAsIndex
}

const fundingSubmissionLineEditorRef = useTemplateRef("fundingSubmissionLineEditorRef")

function openFundingSubmissionLineEditDialog(fundingSubmissionLineId: number) {
  fundingSubmissionLineEditorRef.value?.open(fundingSubmissionLineId)
}

useBreadcrumbs("Submission Lines", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Submission Lines",
    to: {
      name: "administration/AdministrationSubmissionLinesPage",
    },
  },
])
</script>
