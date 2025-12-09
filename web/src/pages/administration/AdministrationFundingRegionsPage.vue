<template>
  <HeaderActionsCard>
    <template #header>
      <!-- TODO: pull in debounced search field from other projects -->
      <v-text-field
        :model-value="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        @update:model-value="debounceUpdateSearch"
      />
    </template>
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/funding-regions/FundingRegionNewPage',
        }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        New Funding Region
      </v-btn>
    </template>

    <FundingRegionsDataTableServer :filters="fundingRegionsFilters" />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { debounce } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type FundingRegionFiltersOptions } from "@/use/use-funding-regions"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingRegionsDataTableServer from "@/components/funding-regions/FundingRegionsDataTableServer.vue"

const search = ref("")

function updateSearch(value: string) {
  search.value = value
}

const debounceUpdateSearch = debounce(updateSearch, 500)

const fundingRegionsFilters = computed(() => {
  const filters: FundingRegionFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

useBreadcrumbs("Funding Regions", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Funding Regions",
    to: {
      name: "administration/FundingRegionsPage",
    },
  },
])
</script>
