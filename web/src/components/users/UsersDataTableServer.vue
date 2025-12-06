<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items="users"
    :items-length="totalCount"
    :loading="isLoading"
    density="comfortable"
    class="row-clickable"
    @dblclick:row="(_event: unknown, { item }: UserTableRow) => goToUserPage(item.id)"
  >
    <template #top="slotProps">
      <slot
        name="top"
        v-bind="slotProps"
      ></slot>
    </template>
    <template #item.firstName="{ item }"> {{ item.firstName }} {{ item.lastName }} </template>
    <template #item.roles="{ value: roles }">
      <UserRoleChip
        v-for="role in roles"
        :key="role"
        class="ma-1"
        :role="role"
      />
    </template>
    <template #item.actions="{ item }">
      <v-btn
        color="yg-moss"
        variant="outlined"
        :to="{
          name: 'administration/users/UserPage',
          params: {
            userId: item.id,
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
import useUsers, {
  type UserAsIndex,
  type UserFiltersOptions,
  type UserWhereOptions,
} from "@/use/use-users"

import UserRoleChip from "@/components/users/UserRoleChip.vue"

const props = withDefaults(
  defineProps<{
    filters?: UserFiltersOptions
    where?: UserWhereOptions
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
    title: "Name",
    key: "firstName",
    minWidth: "200px",
  },
  {
    title: "Email",
    key: "email",
    minWidth: "200px",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Roles",
    key: "roles",
    align: "center" as const,
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
    key: "firstName",
    order: "asc",
  },
])

const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const usersQuery = computed(() => {
  return {
    filters: props.filters,
    where: props.where,
    order: order.value,
    page: page.value,
    perPage: perPage.value,
  }
})
const { users, totalCount, isLoading } = useUsers(usersQuery, {
  skipWatchIf: () => props.waiting,
})

const router = useRouter()

type UserTableRow = {
  item: UserAsIndex
}

function goToUserPage(userId: number) {
  router.push({
    name: "administration/users/UserPage",
    params: {
      userId,
    },
  })
}
</script>
