<template>
  <v-toolbar
    color="#0097a966"
    density="compact"
  >
    <v-tabs v-model="value">
      <v-tab
        value="0"
        :to="{ name: 'CentreDashboard-SummaryTab-ReconciliationTab' }"
      >
        Reconciliation
      </v-tab>
      <v-tab
        value="1"
        :to="{ name: 'CentreDashboard-SummaryTab-WorksheetsTab' }"
      >
        Worksheets
      </v-tab>
      <v-tab
        value="2"
        :to="{ name: 'CentreDashboard-SummaryTab-PaymentsTab' }"
      >
        Payments
      </v-tab>
    </v-tabs>
  </v-toolbar>

  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const value = ref("0")
</script>
