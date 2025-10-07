<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="fundingPeriods"
    :items-length="totalCount"
    :loading="isLoading"
    density="comfortable"
    class="row-clickable"
    @dblclick:row="
      (_event: unknown, { item }: FundingPeriodTableRow) => goToFundingPeriodPage(item.id)
    "
  >
    <template #top="slotProps">
      <slot
        name="top"
        v-bind="slotProps"
      ></slot>
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="yg-moss"
        variant="outlined"
        :to="{
          name: 'administration/funding-periods/FundingPeriodPage',
          params: {
            fundingPeriodId: item.id,
          },
        }"
        >View</v-btn
      >
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"

import { integerTransformer } from "@/utils/use-route-query-transformers"
import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"
import useFundingPeriods, {
  type FundingPeriodAsIndex,
  type FundingPeriodFiltersOptions,
  type FundingPeriodWhereOptions,
} from "@/use/use-funding-periods"

const props = withDefaults(
  defineProps<{
    filters?: FundingPeriodFiltersOptions
    where?: FundingPeriodWhereOptions
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
    title: "Fiscal Year",
    key: "fiscalYear",
  },
  {
    title: "Title",
    key: "title",
    minWidth: "200px",
  },
  {
    title: "From Date",
    key: "fromDate",
  },
  {
    title: "To Date",
    key: "toDate",
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
    key: "fiscalYear",
    order: "desc",
  },
])

const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const fundingPeriodsQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})
const { fundingPeriods, totalCount, isLoading } = useFundingPeriods(fundingPeriodsQuery, {
  skipWatchIf: () => props.waiting,
})

const router = useRouter()

type FundingPeriodTableRow = {
  item: FundingPeriodAsIndex
}

function goToFundingPeriodPage(fundingPeriodId: number) {
  router.push({
    name: "administration/funding-periods/FundingPeriodPage",
    params: {
      fundingPeriodId,
    },
  })
}
</script>
