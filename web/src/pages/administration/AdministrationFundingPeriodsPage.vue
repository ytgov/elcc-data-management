<template>
  <HeaderActionsCard>
    <template #header>
      <v-text-field
        v-model="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
      />
    </template>
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/funding-periods/FundingPeriodNewPage',
        }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        New Funding Period
      </v-btn>
    </template>

    <FundingPeriodsDataTableServer :filters="fundingPeriodsFilters" />
  </HeaderActionsCard>
</template>
<script setup lang="ts">
import { ref, computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type FundingPeriodFiltersOptions } from "@/use/use-funding-periods"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingPeriodsDataTableServer from "@/components/funding-periods/FundingPeriodsDataTableServer.vue"

const search = ref("")

const fundingPeriodsFilters = computed(() => {
  const filters: FundingPeriodFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

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
