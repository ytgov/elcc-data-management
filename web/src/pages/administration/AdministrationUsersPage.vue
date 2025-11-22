<template>
  <HeaderActionsCard title="Users">
    <template #header>
      <v-text-field
        v-model="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
      />
    </template>
    <template
      v-if="isSystemAdmin"
      #header-actions
    >
      <v-btn
        color="primary"
        :to="{
          name: 'administration/users/UserNewPage',
        }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        Add User
      </v-btn>
    </template>

    <UsersDataTableServer :filters="usersFilters" />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import { type UserFiltersOptions } from "@/use/use-users"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import UsersDataTableServer from "@/components/users/UsersDataTableServer.vue"

const { isSystemAdmin } = useCurrentUser()
const search = ref("")

const usersFilters = computed(() => {
  const filters: UserFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

const breadcrumbs = computed(() => [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Users",
    to: {
      name: "administration/UsersPage",
    },
  },
])

useBreadcrumbs("Users", breadcrumbs)
</script>
