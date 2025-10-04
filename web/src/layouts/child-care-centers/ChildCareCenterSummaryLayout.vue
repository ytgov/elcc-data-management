<template>
  <v-toolbar
    color="#0097a966"
    density="compact"
  >
    <v-tabs>
      <v-tab
        :to="{
          name: 'child-care-centers/summary/SummaryReconciliationPage',
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

<script setup lang="ts">
defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()
</script>
