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
      :model-value="fiscalYear"
      label="Fiscal year"
      class="float-right"
      style="width: 200px"
      variant="outlined"
      density="compact"
      @update:modelValue="updateFiscalYearAndRedirect"
    />
  </div>
  <h1 class="mb-4">{{ selectedCentre?.name }}</h1>

  <v-row
    v-if="selectedCentre && selectedCentre.id"
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
            title="Edit"
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
              :subtitle="selectedCentre.license || ''"
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
              :subtitle="FormatYesNo(selectedCentre.hotMeal || false)"
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
              :subtitle="selectedCentre.licensedFor || ''"
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
              :subtitle="selectedCentre.community"
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
              :subtitle="formatDate(selectedCentre.lastSubmission)"
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
        <template v-if="!isEmpty(fiscalYearSlug)">
          <v-tabs grow>
            <v-tab
              :to="{
                name: 'CentreDashboardSummaryPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Summary
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardWorksheetsPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Worksheets
            </v-tab>
            <v-tab
              :to="{
                name: 'CentreDashboardEmployeesPage',
                params: { centreId, fiscalYearSlug },
              }"
            >
              Employees
            </v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <router-view></router-view>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <CentreCreateOrEditDialog />
</template>

<script lang="ts">
import { isNil, isEmpty } from "lodash"

import { FormatDate, FormatYesNo } from "@/utils"
import { mapActions, mapState } from "pinia"
import VueApexCharts from "vue3-apexcharts"

import { getCurrentFiscalYearSlug } from "@/api/fiscal-periods-api"
import EnrollmentChart from "../components/EnrollmentChart.vue"
import CentreCreateOrEditDialog from "@/modules/centre/components/CentreCreateOrEditDialog.vue"
import { useCentreStore } from "@/modules/centre/store"

export default {
  name: "CentreDashboardPage",
  components: {
    VueApexCharts,
    EnrollmentChart,
    CentreCreateOrEditDialog,
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
  async mounted() {
    if (isEmpty(this.fiscalYearSlug)) {
      const currentFiscalYearSlug = getCurrentFiscalYearSlug()
      this.updateFiscalYearAndRedirect(currentFiscalYearSlug)
    }

    const centre = await this.selectCentreById(this.centreId)
    if (isNil(centre)) {
      throw new Error(`Could not load centre from id=${this.centreId}`)
    }
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
        { title: this.selectedCentre?.name || "loading ..." },
      ]
    },
    fiscalYear() {
      return this.fiscalYearSlug.replace("-", "/")
    },
  },
  methods: {
    isEmpty,
    ...mapActions(useCentreStore, ["selectCentreById", "unselectCentre", "editCentre"]),
    formatDate(input: Date | string | null | undefined) {
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
        name: this.$route.name || "CentreDashboardPage",
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
