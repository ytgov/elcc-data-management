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
      <v-tab
        :to="{
          name: 'CentreDashboardSummaryWorksheetsPage',
          params: {
            centreId,
            fiscalYearSlug,
          },
        }"
      >
        Worksheets
      </v-tab>
      <v-tab
        :to="{
          name: 'CentreDashboardSummaryPaymentsPage',
          params: {
            centreId,
            fiscalYearSlug,
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
