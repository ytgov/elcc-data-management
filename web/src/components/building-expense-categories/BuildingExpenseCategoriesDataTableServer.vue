<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="buildingExpenseCategories"
    :items-length="totalCount"
    :loading="isLoading || waiting"
    class="row-clickable"
    density="comfortable"
    multi-sort
    @dblclick:row="
      (_event: unknown, { item }: BuildingExpenseCategoryTableRow) =>
        goToBuildingExpenseCategoryPage(item.id)
    "
  >
    <template #item.fundingRegion.region="{ item }">
      <FundingRegionAttributesChip :funding-region="item.fundingRegion" />
    </template>
    <template #item.categoryName="{ item }">
      {{ item.categoryName }}
    </template>
    <template #item.subsidyRate="{ item }">
      {{ Big(item.subsidyRate).mul(100).toFixed(0) }} cents / $
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="yg-moss"
        variant="outlined"
        :to="{
          name: 'administration/building-expense-categories/BuildingExpenseCategoryPage',
          params: {
            buildingExpenseCategoryId: item.id,
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
import Big from "big.js"

import { integerTransformer } from "@/utils/use-route-query-transformers"

import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"
import useBuildingExpenseCategories, {
  type BuildingExpenseCategoryAsIndex,
  type BuildingExpenseCategoryFiltersOptions,
  type BuildingExpenseCategoryWhereOptions,
} from "@/use/use-building-expense-categories"

import FundingRegionAttributesChip from "@/components/funding-regions/FundingRegionAttributesChip.vue"

const props = withDefaults(
  defineProps<{
    filters?: BuildingExpenseCategoryFiltersOptions
    where?: BuildingExpenseCategoryWhereOptions
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
    title: "Funding Region",
    key: "fundingRegion.region",
  },
  {
    title: "Category name",
    key: "categoryName",
  },
  {
    title: "Subsidy Rate",
    key: "subsidyRate",
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
    key: "fundingRegion.region",
    order: "asc",
  },
  {
    key: "categoryName",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const buildingExpenseCategoriesQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})

const { buildingExpenseCategories, totalCount, isLoading } = useBuildingExpenseCategories(
  buildingExpenseCategoriesQuery,
  {
    skipWatchIf: () => props.waiting,
  }
)

const router = useRouter()

type BuildingExpenseCategoryTableRow = {
  item: BuildingExpenseCategoryAsIndex
}

function goToBuildingExpenseCategoryPage(buildingExpenseCategoryId: number) {
  router.push({
    name: "administration/building-expense-categories/BuildingExpenseCategoryPage",
    params: {
      buildingExpenseCategoryId,
    },
  })
}
</script>
