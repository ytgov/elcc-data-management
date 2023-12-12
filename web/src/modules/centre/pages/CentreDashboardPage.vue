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
    <FiscalYearSelect
      v-model="fiscalYear"
      label="Fiscal year"
      class="float-right"
      style="width: 200px"
      variant="outlined"
      density="compact"
      @update:modelValue="updateFiscalYearAndRedirect"
    />
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
          <EnrollmentChart :centre-id="centreId.toString()" />
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
        <v-tabs grow>
          <v-tab
            :to="{
              name: 'CentreDashboardSummaryPage',
              params: { centreId },
            }"
          >
            Summary
          </v-tab>
          <v-tab
            :to="{
              name: 'CentreDashboard-WorksheetsTab',
              params: { centreId },
            }"
          >
            Worksheets
          </v-tab>
          <v-tab
            :to="{
              name: 'CentreDashboardEmployeesPage',
              params: { centreId },
            }"
          >
            Employees
          </v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <router-view></router-view>
      </v-card>
    </v-col>
  </v-row>

  <CentreEditor />
</template>

<script lang="ts">
import { isNil, isEmpty } from "lodash"

import { FormatDate, FormatYesNo } from "@/utils"
import { mapActions, mapState } from "pinia"
import VueApexCharts from "vue3-apexcharts"

import EnrollmentChart from "../components/EnrollmentChart.vue"
import CentreEditor from "../components/CentreEditor.vue"
import { type ChildCareCentre, useCentreStore } from "../store"

export default {
  name: "CentreDashboard",
  components: {
    VueApexCharts,
    EnrollmentChart,
    CentreEditor,
  },
  props: {
    centreId: {
      type: Number,
      required: true,
    },
    fiscalYearSlug: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentCentre: { name: "" } as ChildCareCentre,
    }
  },
  async mounted() {
    if (isEmpty(this.fiscalYearSlug)) {
      this.updateFiscalYearAndRedirect(this.currentFiscalYearSlug)
    }

    const centre = await this.selectCentreById(this.centreId)
    if (isNil(centre)) {
      throw new Error(`Could not load centre from id=${this.centreId}`)
    }

    this.currentCentre = centre
  },
  unmounted() {
    this.unselectCentre()
  },
  computed: {
    ...mapState(useCentreStore, ["selectedCentre"]),
    breadcrumbs() {
      return [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
        { title: this.currentCentre.name },
      ]
    },
    fiscalYear() {
      return this.fiscalYearSlug.replace("-", "/")
    },
    // TODO: if fiscal year start date ends up being configurable
    // this should be loaded from the funding_periods table instead of computed here.
    currentFiscalYearSlug() {
      const APRIL = 3 // April is the 4th month but JavaScript months are 0-indexed
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const isAfterFiscalYearStart = currentDate.getMonth() >= APRIL

      // If the current date is after the start of the fiscal year, the fiscal year is the current year and the next year.
      // Otherwise, the fiscal year is the previous year and the current year.
      const startYear = isAfterFiscalYearStart ? currentYear : currentYear - 1
      const endYear = startYear + 1
      const endYearShort = endYear.toString().slice(-2)
      return `${startYear}-${endYearShort}`
    },
  },
  methods: {
    ...mapActions(useCentreStore, ["selectCentreById", "unselectCentre", "editCentre"]),
    FormatDate(input: Date | undefined) {
      return input != null ? FormatDate(input) : ""
    },
    FormatYesNo(input: boolean) {
      return FormatYesNo(input)
    },
    editClick() {
      if (this.selectedCentre) this.editCentre(this.selectedCentre)
    },
    updateFiscalYearAndRedirect(value: string) {
      this.$router.push({
        name: this.$route.name || "CentreDashboard",
        params: {
          ...this.$route.params,
          fiscalYearSlug: value.replace("/", "-"),
        },
        query: this.$route.query,
      })
    },
  },
}
</script>
