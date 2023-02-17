<template>
  <base-card showHeader="t" heading="">
    <template v-slot:left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"></v-text-field>
    </template>
    <template v-slot:right>
      <v-btn color="primary" size="small">New User</v-btn>
    </template>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="items"
      :loading="isLoading"
      @click:row="rowClick"></v-data-table>
  </base-card>

  <user-editor></user-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useAdminStore } from "../store";
import UserEditor from "../components/UserEditor.vue";

export default {
  components: { UserEditor },
  data: () => ({
    headers: [
      { title: "Name", value: "display_name" },
      { title: "Email", value: "email" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useAdminStore, ["users", "isLoading"]),
    items() {
      return this.users;
    },
    totalItems() {
      return this.users.length;
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useAdminStore, ["getAllUsers", "selectUser"]),

    async loadItems() {
      await this.getAllUsers();
    },
    rowClick(event: Event, { item }) {
      this.selectUser(item.value);
    },
  },
};
</script>
