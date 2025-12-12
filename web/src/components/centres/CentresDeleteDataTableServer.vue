<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="centres"
    :items-length="totalCount"
    :loading="isLoading || waiting || isDeleting"
    class="row-clickable"
    density="comfortable"
    multi-sort
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
    <template #item.actions="{ item }">
      <v-btn
        color="error"
        variant="outlined"
        :loading="isDeleting && deletingCentreId === item.id"
        @click="confirmAndDeleteCentre(item.id)"
      >
        Delete
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
import { computed, ref } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { useRouter } from "vue-router"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import { integerTransformer } from "@/utils/use-route-query-transformers"

import centresApi, { type CentreAsIndex } from "@/api/centres-api"

import useSnack from "@/use/use-snack"
import useVuetifySortByToSafeRouteQuery from "@/use/vuetify/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/vuetify/use-vuetify-sort-by-to-sequelize-safe-order"
import useCentres, { type CentreFiltersOptions, type CentreWhereOptions } from "@/use/use-centres"

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
  deleted: [centreId: number]
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

const { centres, totalCount, isLoading, refresh } = useCentres(centresQuery, {
  skipWatchIf: () => props.waiting,
})

const router = useRouter()
const snack = useSnack()

const isDeleting = ref(false)
const deletingCentreId = ref<number | null>(null)

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

async function confirmAndDeleteCentre(centreId: number) {
  const shouldDelete = blockedToTrueConfirm(
    "Are you sure you want to delete this centre? This action cannot be undone."
  )

  if (!shouldDelete) {
    return
  }

  isDeleting.value = true
  deletingCentreId.value = centreId

  try {
    await centresApi.delete(centreId)

    snack.success("Centre deleted.")

    emit("deleted", centreId)

    await refresh()
  } catch (error) {
    console.error(`Failed to delete centre: ${error}`, { error })

    snack.error(`Failed to delete centre: ${error}`)
  } finally {
    isDeleting.value = false
    deletingCentreId.value = null
  }
}
</script>
