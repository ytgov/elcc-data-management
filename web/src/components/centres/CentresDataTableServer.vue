<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="centres"
    :items-length="totalCount"
    :loading="isLoading || waiting"
    class="row-clickable"
    density="comfortable"
    multi-sort
    @click:row="(_event: unknown, { item }: CentreTableRow) => emit('click:row', item.id)"
    @dblclick:row="(_event: unknown, { item }: CentreTableRow) => goToCentrePage(item.id)"
  >
    <template #item.name="{ item }">
      {{ item.name }}
    </template>
    <template #item.community="{ item }">
      {{ item.community }}
    </template>
    <template #item.status="{ item }">
      {{ item.status }}
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

import { integerTransformer } from "@/utils/use-route-query-transformers"

import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"
import useCentres, {
  type CentreAsIndex,
  type CentreFiltersOptions,
  type CentreWhereOptions,
} from "@/use/use-centres"

const props = withDefaults(
  defineProps<{
    filters?: CentreFiltersOptions
    where?: CentreWhereOptions
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

const emit = defineEmits<{
  "click:row": [centreId: number]
}>()

const headers = computed(() => [
  {
    title: "Name",
    key: "name",
    sortable: true,
  },
  {
    title: "Community",
    key: "community",
    sortable: true,
  },
  {
    title: "Status",
    key: "status",
    sortable: true,
  },
  // TODO: add actions column with preview and edit buttons
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
    key: "name",
    order: "asc",
  },
])
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const centresQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})

const { centres, totalCount, isLoading } = useCentres(centresQuery, {
  skipWatchIf: () => props.waiting,
})

const router = useRouter()

type CentreTableRow = {
  item: CentreAsIndex
}

function goToCentrePage(centreId: number) {
  router.push({
    name: "child-care-centers/ChildCareCenterRedirect",
    params: {
      centreId,
    },
  })
}
</script>
