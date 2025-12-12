<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="fundingRegions"
    :items-length="totalCount"
    :loading="isLoading || waiting"
    density="comfortable"
    class="row-clickable"
    @dblclick:row="
      (_event: unknown, { item }: FundingRegionTableRow) => goToFundingRegionPage(item.id)
    "
  >
    <template #item.region="{ item }">
      {{ startCase(item.region) }}
    </template>
    <template #item.subsidyRate="{ item }">
      {{ Big(item.subsidyRate).mul(100).toFixed(0) }} cents / $
    </template>
    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
    <template #item.updatedAt="{ item }">
      {{ formatDate(item.updatedAt) }}
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="yg-moss"
        variant="outlined"
        :to="{
          name: 'administration/funding-regions/FundingRegionPage',
          params: {
            fundingRegionId: item.id,
          },
        }"
      >
        View
      </v-btn>
    </template>
    <template #top="slotProps">
      <slot
        name="top"
        v-bind="slotProps"
      ></slot>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"
import { startCase } from "lodash"
import Big from "big.js"

import { formatDate } from "@/utils/formatters"
import { integerTransformer } from "@/utils/use-route-query-transformers"

import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"
import useFundingRegions, {
  type FundingRegionAsIndex,
  type FundingRegionFiltersOptions,
  type FundingRegionWhereOptions,
} from "@/use/use-funding-regions"

const props = withDefaults(
  defineProps<{
    filters?: FundingRegionFiltersOptions
    where?: FundingRegionWhereOptions
    routeQuerySuffix?: string
    waiting?: boolean
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    routeQuerySuffix: "",
    waiting: false,
  }
)

const headers = computed(() => [
  {
    title: "Region",
    key: "region",
  },
  {
    title: "Subsidy Rate",
    key: "subsidyRate",
  },
  {
    title: "Created At",
    key: "createdAt",
  },
  {
    title: "Updated At",
    key: "updatedAt",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },
])

const page = useRouteQuery<string | undefined, number | undefined>(
  `page${props.routeQuerySuffix}`,
  "1",
  {
    transform: integerTransformer,
  }
)
const perPage = useRouteQuery<string | undefined, number | undefined>(
  `perPage${props.routeQuerySuffix}`,
  "10",
  {
    transform: integerTransformer,
  }
)
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  {
    key: "region",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const fundingRegionsQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})
const { fundingRegions, totalCount, isLoading } = useFundingRegions(fundingRegionsQuery, {
  skipWatchIf: () => props.waiting,
})

const router = useRouter()

type FundingRegionTableRow = {
  item: FundingRegionAsIndex
}

function goToFundingRegionPage(fundingRegionId: number) {
  router.push({
    name: "administration/funding-regions/FundingRegionPage",
    params: {
      fundingRegionId,
    },
  })
}
</script>
