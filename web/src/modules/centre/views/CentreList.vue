<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff"
  >
    <template #prepend>
      <v-icon
        color="white"
        icon="mdi-home"
      ></v-icon>
    </template>
    <template #divider>
      <v-icon
        color="white"
        icon="mdi-chevron-right"
      ></v-icon>
    </template>
  </v-breadcrumbs>

  <v-btn
    class="float-right"
    color="primary"
    @click="addCentreClick"
    >Add Centre</v-btn
  >

  <h1 class="mb-4">Child Care Centres</h1>

  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <v-card elevation="3">
        <v-text-field
          v-model="search"
          label="Search"
        ></v-text-field>
        <v-data-table
          density="comfortable"
          :headers="[
            { title: 'Name', value: 'name', sortable: true },
            { title: 'Community', value: 'community', sortable: true },
            { title: 'Status', value: 'status', sortable: true },
          ]"
          :items="centres"
          :search="search"
          class="row-clickable"
          @click:row="tableRowClick"
          @dblclick:row="(_event: any, { item }: any) => goToCentre(item.id)"
        ></v-data-table>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        color="#F2A90066"
        elevation="3"
      >
        <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="!selectedItem.name">Select an item for more information</div>
          <div v-else>
            <h2 class="mb-3">
              {{ selectedItem.name }}
            </h2>

            <v-list
              lines="one"
              density="comfortable"
              style="background-color: inherit"
            >
              <v-list-item
                title="License"
                :subtitle="selectedItem.license || ''"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-file-certificate"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Hot Meal"
                :subtitle="FormatYesNo(selectedItem.hotMeal || false)"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-silverware"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Licensed For"
                :subtitle="selectedItem.licensedFor ?? undefined"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-account-group"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Community"
                :subtitle="selectedItem.community"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-map"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                title="Last Submission"
                :subtitle="formatDate(selectedItem.lastSubmission)"
                class="pl-0"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-calendar"
                    style="margin-inline-end: 10px"
                  ></v-icon>
                </template>
              </v-list-item>
            </v-list>

            <v-btn
              variant="flat"
              class="mt-5 float-right"
              size="small"
              color="primary"
              :to="{ name: 'CentreDashboardPage', params: { centreId: selectedItem.id } }"
              >View Details</v-btn
            >
            <div style="clear: both"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <CentreCreateDialog @saved="goToCentre" />
</template>

<script lang="ts">
import { FormatDate, FormatYesNo } from "@/utils"
import { mapActions, mapState } from "pinia"
import { useCentreStore, Centre, CentreRegions, CentreStatuses } from "@/modules/centre/store"
import CentreCreateDialog from "@/modules/centre/components/CentreCreateDialog.vue"

export default {
  name: "CentreList",
  components: { CentreCreateDialog },
  setup() {},
  data() {
    return {
      search: "",
      breadcrumbs: [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
      ],
      selectedItem: {} as Centre,
    }
  },
  computed: {
    ...mapState(useCentreStore, ["centres"]),
  },
  methods: {
    ...mapActions(useCentreStore, ["selectCentre", "editCentre"]),
    tableRowClick(event: any, item: any) {
      this.selectedItem = item.item
    },
    goToCentre(centreId: string | number) {
      this.$router.push({
        name: "CentreDashboardPage",
        params: { centreId },
      })
    },
    addCentreClick() {
      this.editCentre({
        community: "Whitehorse",
        hotMeal: true,
        isFirstNationProgram: false,
        license: "",
        licensedFor: 10,
        name: "",
        region: CentreRegions.WHITEHORSE,
        status: CentreStatuses.ACTIVE,
      })
    },
    formatDate(input: Date | string | null | undefined) {
      return input != null ? FormatDate(input) : ""
    },
    FormatYesNo(input: boolean) {
      return FormatYesNo(input)
    },
  },
}
</script>
