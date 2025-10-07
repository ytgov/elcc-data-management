<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="fundingSubmissionLines"
    :items-length="totalCount"
    :loading="isLoading"
    density="comfortable"
    class="row-clickable"
    @dblclick:row="
      (_event: unknown, { item }: FundingSubmissionLineTableRow) =>
        goToFundingSubmissionLinePage(item.id)
    "
  >
    <template #top="slotProps">
      <slot
        name="top"
        v-bind="slotProps"
      ></slot>
    </template>
    <template #item.ageRange="{ item }">
      {{ item.fromAge }} - {{ item.toAge }}
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="yg-moss"
        variant="outlined"
        :to="{
          name: 'administration/submission-lines/SubmissionLinePage',
          params: {
            fundingSubmissionLineId: item.id,
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
import {
  useVuetifySortByToSafeRouteQuery,
  useVuetifySortByToSequelizeSafeOrder,
} from "@/use/vuetify"
import useFundingSubmissionLines, {
  type FundingSubmissionLineAsIndex,
  type FundingSubmissionLineFiltersOptions,
  type FundingSubmissionLineWhereOptions,
} from "@/use/use-funding-submission-lines"

const props = withDefaults(
  defineProps<{
    filters?: FundingSubmissionLineFiltersOptions
    where?: FundingSubmissionLineWhereOptions
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
    title: "Section",
    key: "sectionName",
    minWidth: "150px",
  },
  {
    title: "Line",
    key: "lineName",
    minWidth: "150px",
  },
  {
    title: "Age Range",
    key: "ageRange",
  },
  {
    title: "Monthly Amount",
    key: "monthlyAmount",
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
    key: "sectionName",
    order: "asc",
  },
  {
    key: "lineName",
    order: "asc",
  },
])

const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const fundingSubmissionLinesQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})
const { fundingSubmissionLines, totalCount, isLoading } = useFundingSubmissionLines(
  fundingSubmissionLinesQuery,
  {
    skipWatchIf: () => props.waiting,
  }
)

const router = useRouter()

type FundingSubmissionLineTableRow = {
  item: FundingSubmissionLineAsIndex
}

function goToFundingSubmissionLinePage(fundingSubmissionLineId: number) {
  router.push({
    name: "administration/submission-lines/SubmissionLinePage",
    params: {
      fundingSubmissionLineId,
    },
  })
}
</script>
