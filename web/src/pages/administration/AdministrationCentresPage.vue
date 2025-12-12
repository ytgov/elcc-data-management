<template>
  <HeaderActionsCard>
    <template #header>
      <v-text-field
        :model-value="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        @update:model-value="debounceUpdateSearch"
      />
    </template>

    <CentresDeleteDataTableServer :filters="centreFilters" />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { debounce } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type CentreFiltersOptions } from "@/use/use-centres"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import CentresDeleteDataTableServer from "@/components/centres/CentresDeleteDataTableServer.vue"

const search = ref("")

function updateSearch(value: string) {
  search.value = value
}

const debounceUpdateSearch = debounce(updateSearch, 500)

const centreFilters = computed(() => {
  const filters: CentreFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

useBreadcrumbs("Centres", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Centres",
    to: {
      name: "administration/CentresPage",
    },
  },
])
</script>
