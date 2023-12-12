<template>
  <v-toolbar
    color="#0097a966"
    density="compact"
  >
    <v-tabs>
      <v-tab
        :to="{
          name: 'CentreDashboardSummaryReconciliationPage',
          params: {
            centreId,
            fiscalYearSlug,
          },
        }"
      >
        Reconciliation
      </v-tab>
      <v-tab :to="{ name: 'CentreDashboard-SummaryTab-WorksheetsTab' }"> Worksheets </v-tab>
      <v-tab
        :to="{
          name: 'CentreDashboard-SummaryTab-PaymentsTab',
          params: {
            centreId,
            // fiscalYear, // TODO: support fiscal year as param
          },
        }"
      >
        Payments
      </v-tab>
    </v-tabs>
  </v-toolbar>

  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref } from "vue"

defineProps({
  centreId: {
    type: String,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    required: true,
  },
})
</script>
