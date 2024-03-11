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
      <CentreDetailsCard :centreId="selectedCentre.id" />
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

import { mapActions, mapState } from "pinia"
import VueApexCharts from "vue3-apexcharts"

import { getCurrentFiscalYearSlug } from "@/api/fiscal-periods-api"
import { useCentreStore } from "@/modules/centre/store"

import EnrollmentChart from "../components/EnrollmentChart.vue"
import CentreCreateOrEditDialog from "@/modules/centre/components/CentreCreateOrEditDialog.vue"
import CentreDetailsCard from "@/modules/centre/components/CentreDetailsCard.vue"

export default {
  name: "CentreDashboardPage",
  components: {
    VueApexCharts,
    EnrollmentChart,
    CentreCreateOrEditDialog,
    CentreDetailsCard,
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
    ...mapActions(useCentreStore, ["selectCentreById", "unselectCentre"]),
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
