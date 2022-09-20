<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs">
      <template v-slot:right>
        <!-- <timed-message ref="messager" class="mr-4"></timed-message> -->
      </template>
    </BaseBreadcrumb>

    <!-- <admin-sidebar></admin-sidebar> -->

    <BaseCard :show-header="true">
      <template v-slot:left>
        <v-text-field
          v-model="search"
          hide-details
          background-color="white"
          label="Search"
          prepend-icon="mdi-magnify"
          :loading="isLoading"
          clearable
        ></v-text-field>
      </template>
      <template v-slot:right> </template>

      <v-card class="default">
        <v-card-text>
          <v-data-table
            :items="users"
            :search="search"
            :headers="[
              { text: 'Name', value: 'display_name' },
              { text: 'Email', value: 'email' },
              { text: 'Status', value: 'status' },
              { text: 'Roles', value: 'roles' },
              { text: 'Departments', value: 'department_admin_for.length' },
            ]"
            @click:row="rowClick"
            class="row-clickable"
            :loading="isLoading"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </BaseCard>

    <notifications ref="notifier"></notifications>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";

export default {
  name: "Home",
  data: () => ({
    page: { title: "Manage Users" },
    breadcrumbs: [
      { text: "Administration", to: "/administration", exact: true },
      { text: "Manage users", disabled: true },
    ],
    search: "",
    isLoading: false,
    users: [],
    editUser: null,
  }),
  async mounted() {
    this.loadUserList();
  },
  methods: {
    ...mapActions("administration", ["loadUsers"]),
    async loadUserList() {
      this.isLoading = true;
      this.users = await this.loadUsers();
      this.isLoading = false;
    },
    saveComplete(resp) {
      this.$refs.notifier.showAPIMessages(resp.data);
      this.loadUserList();
    },
    rowClick(item) {
      this.$refs.userEditor.show(_.clone(item));
    },
  },
};
</script>
