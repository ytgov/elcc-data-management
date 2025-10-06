<template>
  <BaseCard show-header>
    <template #left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"
      ></v-text-field>
    </template>
    <template #right>
      <v-btn
        color="primary"
        size="small"
        @click="openFundingPeriodCreationDialog"
        >New Funding Period</v-btn
      >
    </template>

    <v-data-table-server
      :headers="headers"
      :items="fundingPeriods"
      :loading="isLoading"
      :items-length="totalCount"
      @click:row="
        (_event: Event, row: FundingPeriodTableRow) => openFundingPeriodEditDialog(row.item.id)
      "
    >
    </v-data-table-server>
    <FundingPeriodEditorDialog ref="fundingPeriodEditorRef" />
  </BaseCard>
</template>
<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingPeriods, {
  type FundingPeriodAsIndex,
  type FundingPeriodFiltersOptions,
} from "@/use/use-funding-periods"

import BaseCard from "@/components/BaseCard.vue"
import FundingPeriodEditorDialog from "@/components/funding-periods/FundingPeriodEditorDialog.vue"

const headers = ref([
  { title: "Fiscal Year", key: "fiscalYear" },
  { title: "Title", key: "title" },
  { title: "From Date", key: "fromDate" },
  { title: "To Date", key: "toDate" },
])

const search = ref("")
const page = ref(1)
const perPage = ref(10)

const fundingPeriodsFilters = computed(() => {
  const filters: FundingPeriodFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})
const fundingPeriodsQuery = computed(() => ({
  filters: fundingPeriodsFilters.value,
  page: page.value,
  perPage: perPage.value,
}))
const { fundingPeriods, totalCount, isLoading } = useFundingPeriods(fundingPeriodsQuery)

function openFundingPeriodCreationDialog() {
  alert("TODO: implement funding period creation")
}

type FundingPeriodTableRow = {
  item: FundingPeriodAsIndex
}

const fundingPeriodEditorRef = useTemplateRef("fundingPeriodEditorRef")

function openFundingPeriodEditDialog(fundingPeriodId: number) {
  fundingPeriodEditorRef.value?.open(fundingPeriodId)
}

useBreadcrumbs("Funding Periods", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Funding Periods",
    to: {
      name: "administration/FundingPeriodsPage",
    },
  },
])
</script>
