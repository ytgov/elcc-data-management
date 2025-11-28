<template>
  <HeaderActionsCard title="Submission Lines">
    <template #header>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <FundingPeriodFiscalYearSelect
            v-model="fiscalYear"
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
          query: newSubmissionLineQuery,
        }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        New Submission Line
      </v-btn>
    </template>

    <FundingSubmissionLinesDataTableServer
      :where="fundingSubmissionLinesWhere"
      :filters="fundingSubmissionLinesFilters"
      :waiting="isWaitingForFiscalYear"
    />
  </HeaderActionsCard>
</template>
<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { isEmpty, isNil } from "lodash"

import {
  getCurrentFiscalYearSlug,
  normalizeFiscalYearToLongForm,
  normalizeFiscalYearToShortForm,
} from "@/utils/fiscal-year"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import {
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingPeriodFiscalYearSelect from "@/components/funding-periods/FundingPeriodFiscalYearSelect.vue"
import FundingSubmissionLinesDataTableServer from "@/components/funding-submission-lines/FundingSubmissionLinesDataTableServer.vue"

const search = ref("")

const CURRENT_FISCAL_YEAR = normalizeFiscalYearToLongForm(getCurrentFiscalYearSlug())
const fiscalYear = useRouteQuery<string | null>("fiscalYear", CURRENT_FISCAL_YEAR)

const fiscalYearLegacy = computed(() => {
  if (isNil(fiscalYear.value)) return null

  const fiscalYearShort = normalizeFiscalYearToShortForm(fiscalYear.value)
  return fiscalYearShort.replace("-", "/")
})

const newSubmissionLineQuery = computed(() => {
  if (isNil(fiscalYear.value) || fiscalYear.value === CURRENT_FISCAL_YEAR) {
    return {}
  }

  return {
    fiscalYear: fiscalYear.value,
  }
})

const fundingSubmissionLinesWhere = computed(() => {
  const where: FundingSubmissionLineWhereOptions = {}

  if (fiscalYearLegacy.value) {
    where.fiscalYear = fiscalYearLegacy.value
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

const isWaitingForFiscalYear = computed(
  () => isNil(fiscalYearLegacy.value) || isEmpty(fiscalYearLegacy.value)
)

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
