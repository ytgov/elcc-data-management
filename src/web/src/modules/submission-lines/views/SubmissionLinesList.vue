<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff"
  >
    <template v-slot:prepend>
      <v-icon
        color="white"
        icon="mdi-home"
      ></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon
        color="white"
        icon="mdi-chevron-right"
      ></v-icon>
    </template>
  </v-breadcrumbs>

  <h1>Submission Format</h1>

  <base-card
    showHeader="t"
    heading=""
  >
    <template v-slot:left>
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
    <template v-slot:right>
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
  </base-card>

  <submission-line-editor></submission-line-editor>

  <funding-fiscal-editor></funding-fiscal-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia"
import { useSubmissionLinesStore } from "../store"
import SubmissionLineEditor from "../components/SubmissionLineEditor.vue"
import FundingFiscalEditor from "../components/FundingFiscalEditor.vue"

export default {
  components: { SubmissionLineEditor, FundingFiscalEditor },
  data: () => ({
    headers: [
      { title: "Section", value: "section_name" },
      { title: "Line", value: "line_name" },
      { title: "Age Range", value: "age_range" },
      { title: "Monthly Amount", value: "monthly_amount_display" },
    ],
    fiscalYear: "2022/23",
    search: "",
  }),
  computed: {
    ...mapState(useSubmissionLinesStore, ["lines", "isLoading", "fiscalYears"]),
    items() {
      return this.lines.filter((y) => y.fiscal_year == this.fiscalYear)
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
          title: "Submission Format",
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
    rowClick(event: Event, thing: any) {
      this.selectLine(thing.item.value)
    },
  },
}
</script>
