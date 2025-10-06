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

    <v-data-table-server
      :headers="headers"
      :items="users"
      :loading="isLoading"
      :items-length="totalCount"
      @click:row="(_event: Event, row: UserTableRow) => openUserEditDialog(row.item.id)"
    >
      <template #item.permissions="{ item }">
        <v-chip
          v-if="item.isAdmin"
          color="yg_moss"
          >Admin</v-chip
        >
        <div v-else>{{ item.roles.length }}</div>
      </template>
    </v-data-table-server>

    <UserEditor ref="userEditorRef" />
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useUsers, { type UserAsIndex, type UserFiltersOptions } from "@/use/use-users"

import BaseCard from "@/components/BaseCard.vue"
import UserEditor from "@/components/users/UserEditorDialog.vue"

const headers = ref([
  { title: "Name", key: "displayName" },
  { title: "Email", key: "email" },
  { title: "Status", key: "status" },
  { title: "Permisions", key: "permissions" },
])

const search = ref("")
const page = ref(1)
const perPage = ref(10)

const usersFilters = computed(() => {
  const filters: UserFiltersOptions = {}

  if (search.value) {
    filters.search = search.value
  }

  return filters
})
const usersQuery = computed(() => ({
  filters: usersFilters.value,
  page: page.value,
  perPage: perPage.value,
}))
const { users, totalCount, isLoading } = useUsers(usersQuery)

function openUserCreationDialog() {
  alert("TODO: implement user creation")
}

type UserTableRow = {
  item: UserAsIndex
}

const userEditorRef = useTemplateRef("userEditorRef")

function openUserEditDialog(userId: number) {
  userEditorRef.value?.open(userId)
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
