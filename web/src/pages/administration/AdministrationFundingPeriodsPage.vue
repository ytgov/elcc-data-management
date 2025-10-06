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
  </BaseCard>

  <funding-period-editor></funding-period-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia"

import {
  useFundingPeriodStore,
  type FundingPeriod,
} from "@/modules/administration/store/FundingPeriod"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import BaseCard from "@/components/BaseCard.vue"
import FundingPeriodEditor from "@/modules/administration/components/FundingPeriodEditor.vue"

export default {
  components: {
    BaseCard,
    FundingPeriodEditor,
  },
  setup() {
    useBreadcrumbs("Funding Periods", [
      {
        title: "Administration",
        to: {
          name: "AdministrationPage",
        },
      },
      {
        title: "Funding Periods",
        to: {
          name: "administration/FundingPeriodsPage",
        },
      },
    ])
  },
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
    rowClick(_event: Event, row: { item: FundingPeriod }) {
      this.selectPeriod(row.item)
    },
  },
}
</script>
