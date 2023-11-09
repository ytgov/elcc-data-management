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

  <div class="float-right">
    <v-select
      v-model="currentFiscalYear"
      label="Fiscal year"
      :items="fiscalYears"
      class="float-right"
      style="width: 200px"
      variant="outlined"
      density="compact"
    ></v-select>
  </div>
  <h1 class="mb-4">{{ currentCentre.name }}</h1>

  <v-row
    v-if="currentCentre && currentCentre.id"
    style="clear: both"
  >
    <v-col
      cols="12"
      md="4"
    >
      <v-card
        elevation="3"
        color="#F2A90066"
        class="mb-5"
      >
        <v-card-title style="background-color: #f2a90068">
          <v-btn
            icon="mdi-pencil"
            size="x-small"
            color="primary"
            class="float-right my-0"
            @click="editClick"
          ></v-btn>
          Child Care Centre Details
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-0">
          <v-list
            lines="one"
            density="comfortable"
            style="background-color: inherit"
          >
            <v-list-item
              title="License"
              :subtitle="currentCentre.license"
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
              :subtitle="FormatYesNo(currentCentre.hotMeal)"
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
              :subtitle="currentCentre.licensedFor"
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
              :subtitle="currentCentre.community"
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
              :subtitle="FormatDate(currentCentre.lastSubmission)"
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
        </v-card-text>
      </v-card>
      <v-card
        elevation="3"
        color="#0097a966"
      >
        <v-card-title style="background-color: #0097a968">Latest Enrollment</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <EnrollmentChart :centre-id="centreId" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <v-card
        class="mb-5 fill-height"
        elevation="3"
      >
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab
            value="option-1"
            :to="{ name: 'CentreDashboard-SummaryTab' }"
          >
            Summary
          </v-tab>
          <v-tab value="option-2"> Worksheets </v-tab>
          <v-tab value="option-3"> Employees </v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <v-window
          v-model="tab"
          class="fill-height"
        >
          <v-window-item value="option-1">
            <router-view></router-view>
          </v-window-item>
          <v-window-item value="option-2">
            <v-toolbar
              color="#0097a966"
              density="compact"
            >
              <v-tabs v-model="month">
                <v-tab
                  v-for="worksheet of yearWorksheets"
                  :value="worksheet.month"
                >
                  {{ worksheet.month }}
                </v-tab>
              </v-tabs>
            </v-toolbar>

            <v-window v-model="month">
              <div
                v-if="yearWorksheets.length == 0"
                class="pa-5"
              >
                <p>There are currently no worksheets for {{ currentFiscalYear }}.</p>
                <v-btn
                  color="primary"
                  size="small"
                  class="mt-3"
                  @click="addFiscalClick"
                  >Add worksheets for {{ currentFiscalYear }}</v-btn
                >
              </div>
              <v-window-item
                v-for="worksheet in yearWorksheets"
                :key="worksheet.month"
                :value="worksheet.month"
              >
                <MonthlyWorksheet :month="worksheet" />
              </v-window-item>
            </v-window>
          </v-window-item>
          <v-window-item value="option-3">
            <h4>Employees</h4>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>

  <centre-editor></centre-editor>
</template>

<script lang="ts">
import { isNil } from "lodash"

import { FormatDate, FormatYesNo } from "@/utils"
import { mapActions, mapState, mapWritableState } from "pinia"
import VueApexCharts from "vue3-apexcharts"
import MonthlyWorksheet from "../components/MonthlyWorksheet.vue"

import EnrollmentChart from "../components/EnrollmentChart.vue"
import CentreEditor from "../components/CentreEditor.vue"
import { type ChildCareCentre, useCentreStore } from "../store"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"

export default {
  name: "CentreDashboard",
  components: {
    VueApexCharts,
    MonthlyWorksheet,
    EnrollmentChart,
    CentreEditor,
  },
  props: {
    centreId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      submissions: [
        { month: "September 2022", payment: "$12,232", enrollment: 43 },
        { month: "October 2022", payment: "$10,134", enrollment: 41 },
        { month: "November 2022", payment: "$11,025", enrollment: 42 },
        { month: "December 2022", payment: "$9,447", enrollment: 39 },
      ],
      tab: "option-1",
      month: "",
      currentCentre: { name: "" } as ChildCareCentre,

      options: {
        stroke: { show: false },
        colors: ["#0094A9", "#002EB7", "#FFAE00", "#FF7A00", "#04DDFB", "#A65000", "#1851FC"],
        labels: [
          "Infant",
          "Toddler",
          "Preschool",
          "Kindergarten PT",
          "Kindergarten FT",
          "School Age PT",
          "School Age FT",
        ],
      },
      series: [2, 8, 14, 5, 2, 4, 2],
    }
  },
  watch: {
    tab(newValue) {
      if (!["option-1"].includes(newValue)) {
        this.$router.push({ name: "CentreDashboard", params: { centreId: this.centreId } })
      }
    },
  },
  async mounted() {
    const centre = await this.selectCentreById(parseInt(this.centreId as string))
    if (isNil(centre)) {
      throw new Error(`Could not load centre from id=${this.centreId}`)
    }

    this.currentCentre = centre

    if (this.tab === "option-1") {
      this.$router.push({ name: "CentreDashboard-SummaryTab", params: { centreId: this.centreId } })
    }

    await this.loadWorksheets(parseInt(this.centreId as string))
  },
  unmounted() {
    this.unselectCentre()
  },
  computed: {
    ...mapState(useCentreStore, ["selectedCentre", "worksheets"]),
    ...mapState(useSubmissionLinesStore, ["fiscalYears"]),
    ...mapWritableState(useSubmissionLinesStore, ["currentFiscalYear"]),
    breadcrumbs() {
      return [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
        { title: this.currentCentre.name },
      ]
    },
    yearWorksheets() {
      const t = this.worksheets.filter((w) => w.fiscalYear == this.currentFiscalYear)
      return t
    },
  },
  methods: {
    ...mapActions(useCentreStore, [
      "selectCentreById",
      "unselectCentre",
      "loadWorksheets",
      "editCentre",
      "addCentreFiscal",
    ]),
    FormatDate(input: Date | undefined) {
      return input != null ? FormatDate(input) : ""
    },
    FormatYesNo(input: boolean) {
      return FormatYesNo(input)
    },
    editClick() {
      if (this.selectedCentre) this.editCentre(this.selectedCentre)
    },
    addFiscalClick() {
      this.addCentreFiscal(this.currentFiscalYear)
    },
  },
}
</script>
