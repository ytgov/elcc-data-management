<template>
  <BaseCard show-header>
    <template #left>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <FiscalPeriodFiscalYearSelect
            v-model="fiscalYearSlug"
            label="Fiscal year"
            single-line
            hide-details
            density="compact"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="search"
            label="Search"
            single-line
            hide-details
            append-inner-icon="mdi-magnify"
            density="compact"
            class="ml-2"
          />
        </v-col>
      </v-row>
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

import getCurrentFiscalYearSlug from "@/utils/get-current-fiscal-year-slug"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingSubmissionLines, {
  type FundingSubmissionLineAsIndex,
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

import BaseCard from "@/components/BaseCard.vue"
import FundingSubmissionLineEditorDialog from "@/components/funding-submission-lines/FundingSubmissionLineEditorDialog.vue"
import FiscalPeriodFiscalYearSelect from "@/components/fiscal-periods/FiscalPeriodFiscalYearSelect.vue"

const headers = ref([
  { title: "Section", key: "sectionName" },
  { title: "Line", key: "lineName" },
  { title: "Age Range", key: "ageRange" },
  { title: "Monthly Amount", key: "monthlyAmountDisplay" },
])

const search = ref("")
const page = ref(1)
const perPage = ref(10)
const fiscalYearSlug = ref(getCurrentFiscalYearSlug())

const fiscalYear = computed(() => fiscalYearSlug.value.replace("-", "/"))

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
