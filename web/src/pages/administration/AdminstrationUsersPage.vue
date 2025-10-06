<template>
  <BaseCard
    show-header="t"
    heading=""
  >
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
        >New User</v-btn
      >
    </template>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="items"
      :loading="isLoading"
      @click:row="rowClick"
    >
      <template #item.permissions="{ item }">
        <v-chip
          v-if="item.isAdmin"
          color="yg_moss"
          >Admin</v-chip
        >
        <div v-else>{{ item.roles.length }}</div>
      </template>
    </v-data-table>
  </BaseCard>

  <user-editor></user-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia"

import { useUserAdminStore, type User } from "@/modules/users/store/index"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import BaseCard from "@/components/BaseCard.vue"
import UserEditor from "@/modules/users/components/UserEditor.vue"

export default {
  components: {
    BaseCard,
    UserEditor,
  },
  setup() {
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
  },
  data: () => ({
    headers: [
      { title: "Name", key: "displayName" },
      { title: "Email", key: "email" },
      { title: "Status", key: "status" },
      { title: "Permisions", key: "permissions" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useUserAdminStore, ["users", "isLoading"]),
    items() {
      return this.users
    },
    totalItems() {
      return this.users.length
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Users",
        },
      ]
    },
  },
  beforeMount() {
    this.loadItems()
  },
  methods: {
    ...mapActions(useUserAdminStore, ["getAllUsers", "selectUser"]),

    async loadItems() {
      await this.getAllUsers()
    },
    rowClick(_event: Event, row: { item: User }) {
      this.selectUser(row.item)
    },
  },
}
</script>
