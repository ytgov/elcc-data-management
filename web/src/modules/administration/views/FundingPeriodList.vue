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

  <h1>Funding Periods</h1>

  <base-card
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
      return-object
      @click:row="rowClick"
    ></v-data-table>
  </base-card>

  <funding-period-editor></funding-period-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia"
import { useFundingPeriodStore } from "../store/FundingPeriod"
import FundingPeriodEditor from "../components/FundingPeriodEditor.vue"

export default {
  components: { FundingPeriodEditor },
  data: () => ({
    headers: [
      { title: "Fiscal Year", value: "fiscalYear" },
      { title: "Title", value: "title" },
      { title: "From Date", value: "toDate" },
      { title: "To Date", value: "fromDate" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useFundingPeriodStore, ["periods", "isLoading"]),
    items() {
      return this.periods
    },
    totalItems() {
      return this.periods.length
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Funding Periods",
        },
      ]
    },
  },
  beforeMount() {
    this.loadItems()
  },
  methods: {
    ...mapActions(useFundingPeriodStore, ["getAllFundingPeriods", "selectPeriod"]),

    async loadItems() {
      await this.getAllFundingPeriods()
    },
    rowClick(event: Event, thing: any) {
      this.selectPeriod(thing.item)
    },
  },
}
</script>
