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

    <FundingPeriodsDataTableServer :filters="fundingPeriodsFilters" />
  </BaseCard>
</template>
<script setup lang="ts">
import { ref, computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type FundingPeriodFiltersOptions } from "@/use/use-funding-periods"

import BaseCard from "@/components/BaseCard.vue"
import FundingPeriodsDataTableServer from "@/components/funding-periods/FundingPeriodsDataTableServer.vue"

const search = ref("")

const fundingPeriodsFilters = computed(() => {
  const filters: FundingPeriodFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

function openFundingPeriodCreationDialog() {
  alert("TODO: implement funding period creation")
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
