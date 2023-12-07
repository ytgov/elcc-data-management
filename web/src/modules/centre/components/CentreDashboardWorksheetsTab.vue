<template>
  <v-toolbar
    color="#0097a966"
    density="compact"
  >
    <v-tabs v-model="value">
      <v-tab
        v-for="month of months"
        :value="month.toLowerCase()"
        :to="{
          name: 'CentreDashboard-WorksheetsTab-MonthlyWorksheetTab',
          params: {
            month: month.toLowerCase(),
          },
        }"
      >
        {{ month }}
      </v-tab>
    </v-tabs>
  </v-toolbar>

  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const months = ref([
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
])

const value = ref("april")
</script>
