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

    <FundingSubmissionLinesDataTableServer
      :where="fundingSubmissionLinesWhere"
      :filters="fundingSubmissionLinesFilters"
    />
  </BaseCard>
</template>
<script setup lang="ts">
import { ref, computed } from "vue"

import getCurrentFiscalYearSlug from "@/utils/get-current-fiscal-year-slug"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import {
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

import BaseCard from "@/components/BaseCard.vue"
import FiscalPeriodFiscalYearSelect from "@/components/fiscal-periods/FiscalPeriodFiscalYearSelect.vue"
import FundingSubmissionLinesDataTableServer from "@/components/funding-submission-lines/FundingSubmissionLinesDataTableServer.vue"

const search = ref("")
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

function openNewFiscalYearDialog() {
  alert("TODO: implement new fiscal year creation")
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
