<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff">
    <template v-slot:prepend>
      <v-icon color="white" icon="mdi-home"></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon color="white" icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <h1 class="mb-4">Child Care Centres</h1>

  <v-row>
    <v-col cols="12" md="8">
      <v-card elevation="3">
        <v-text-field v-model="search" label="Search"></v-text-field>
        <v-data-table
          density="comfortable"
          :headers="[
            { title: 'Name', value: 'name', sortable: true },
            { title: 'Community', value: 'community', sortable: true },
            { title: 'Status', value: 'status', sortable: true },
          ]"
          :items="items"
          :search="search"
          @click:row="tableRowClick"></v-data-table>
      </v-card>
    </v-col>
    <v-col>
      <v-card color="#F2A90066" elevation="3">
        <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="!selectedItem.name">Select an item for more information</div>
          <div v-else>
            <h2 class="mb-3">
              {{ selectedItem.name }}
            </h2>

            <v-list lines="one" density="comfortable" style="background-color: inherit">
              <v-list-item title="License" subtitle="19-1234" class="pl-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-certificate" style="margin-inline-end: 10px"></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item title="Hot Meal" subtitle="Yes" class="pl-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-silverware" style="margin-inline-end: 10px"></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item title="Licensed For" subtitle="19" class="pl-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-account-group" style="margin-inline-end: 10px"></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item title="Community" subtitle="Tagish" class="pl-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-map" style="margin-inline-end: 10px"></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item title="Last Submission" subtitle="December 2022" class="pl-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar" style="margin-inline-end: 10px"></v-icon>
                </template>
              </v-list-item>
            </v-list>

            <v-btn
              variant="flat"
              class="mt-5 float-right"
              size="small"
              color="primary"
              :to="`/child-care-centres/${selectedItem.id}`"
              >View Details</v-btn
            >
            <div style="clear: both"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  setup() {},
  name: "CentreList",
  data() {
    return {
      search: "",
      breadcrumbs: [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
      ],
      items: [
        { name: "Grow with Joy 2nd", community: "Whitehorse", id: 43, status: "Up to date" },
        { name: "Grow with Joy 4th", community: "Whitehorse", id: 41, status: "Up to date" },
        { name: "Happy Hearts Preschool", community: "Whitehorse", id: 42, status: "Up to date" },
        { name: "Michael's Day Home", community: "Tagish", id: 39, status: "Behind" },
        { name: "Heart of Riverdale", community: "Whitehorse", id: 39, status: "Up to date" },
      ],
      selectedItem: { id: -1, name: undefined },
    };
  },
  methods: {
    tableRowClick(event: any, item: any) {
      console.log("CLICK", item.item);
      this.selectedItem = item.item.raw;
    },
    goToCentre() {
      this.$router.push(`/child-care-centres/${this.selectedItem.id}`);
    },
  },
};
</script>
