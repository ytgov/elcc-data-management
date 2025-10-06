<template>
  <BaseCard
    show-header="t"
    heading=""
  >
    <template #left>
      <v-select
        v-model="fiscalYear"
        :items="fiscalYears"
        label="Fiscal year"
        single-line
        style="width: 100px"
        hide-details
      ></v-select>

      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        class="ml-2"
      ></v-text-field>
    </template>
    <template #right>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        @click="startNewFiscal"
        >New Fiscal Year</v-btn
      >
    </template>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="items"
      :loading="isLoading"
      return-object
      density="compact"
      class="row-clickable"
      @click:row="rowClick"
    ></v-data-table>
  </BaseCard>

  <SubmissionLineEditor />

  <FundingFiscalEditor />
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia"

import {
  useSubmissionLinesStore,
  type FundingSubmissionLine,
} from "@/modules/submission-lines/store/index"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import BaseCard from "@/components/BaseCard.vue"
import SubmissionLineEditor from "@/modules/submission-lines/components/SubmissionLineEditor.vue"
import FundingFiscalEditor from "@/modules/submission-lines/components/FundingFiscalEditor.vue"

export default {
  components: {
    BaseCard,
    FundingFiscalEditor,
    SubmissionLineEditor,
  },
  setup() {
    useBreadcrumbs("Submission Lines", [
      {
        title: "Administration",
        to: {
          name: "AdministrationPage",
        },
      },
      {
        title: "Submission Lines",
        to: {
          name: "administration/AdministrationSubmissionLinesPage",
        },
      },
    ])
  },
  data: () => ({
    headers: [
      { title: "Section", value: "sectionName" },
      { title: "Line", value: "lineName" },
      { title: "Age Range", value: "ageRange" },
      { title: "Monthly Amount", value: "monthlyAmountDisplay" },
    ],
    fiscalYear: "2022/23",
    search: "",
  }),
  computed: {
    ...mapState(useSubmissionLinesStore, ["lines", "isLoading", "fiscalYears"]),
    items() {
      return this.lines.filter((y) => y.fiscalYear == this.fiscalYear)
    },
    totalItems() {
      return this.lines.length
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Submission Lines",
        },
      ]
    },
  },
  beforeMount() {
    this.loadItems()
  },
  methods: {
    ...mapActions(useSubmissionLinesStore, [
      "getAllSubmissionLines",
      "selectLine",
      "startNewFiscal",
    ]),

    async loadItems() {
      await this.getAllSubmissionLines()
    },
    rowClick(_event: Event, row: { item: FundingSubmissionLine }) {
      this.selectLine(row.item)
    },
  },
}
</script>
