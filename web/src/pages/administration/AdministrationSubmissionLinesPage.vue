<template>
  <HeaderActionsCard title="Submission Lines">
    <template #header>
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
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/submission-lines/SubmissionLineNewPage',
        }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        New Submission Line
      </v-btn>
    </template>

    <FundingSubmissionLinesDataTableServer
      :where="fundingSubmissionLinesWhere"
      :filters="fundingSubmissionLinesFilters"
    />
  </HeaderActionsCard>
</template>
<script setup lang="ts">
import { ref, computed } from "vue"

import { getCurrentFiscalYearSlug } from "@/utils/fiscal-year"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import {
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
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
