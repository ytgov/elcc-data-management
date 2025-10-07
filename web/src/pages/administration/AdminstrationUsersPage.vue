<template>
  <BaseCard show-header>
    <template #left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"
      ></v-text-field>
    </template>
    <template #right>
      <v-btn
        color="primary"
        size="small"
        @click="openUserCreationDialog"
        >New User</v-btn
      >
    </template>

    <UsersDataTableServer :filters="usersFilters" />
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type UserFiltersOptions } from "@/use/use-users"

import BaseCard from "@/components/BaseCard.vue"
import UsersDataTableServer from "@/components/users/UsersDataTableServer.vue"

const search = ref("")

const usersFilters = computed(() => {
  const filters: UserFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})

function openUserCreationDialog() {
  alert("TODO: implement user creation")
}

useBreadcrumbs("Users", [
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
</script>
