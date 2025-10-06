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

  <h1>Administration</h1>

  <v-row>
    <v-col>
      <v-card to="/administration/users">
        <v-card-title>Users</v-card-title>
        <v-card-text>
          <span class="text-h4">{{ usersTotalCount }}</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card to="/administration/funding-periods">
        <v-card-title>Funding Periods</v-card-title>
        <v-card-text>
          <span class="text-h4">{{ fundingPeriodsTotalCount }}</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card to="/administration/submission-lines">
        <v-card-title>Submission Lines</v-card-title>
        <v-card-text>
          <span class="text-h4">{{ fundingSubmissionLinesTotalCount }}</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"

import useFundingPeriods from "@/use/use-funding-periods"
import useFundingSubmissionLines from "@/use/use-funding-submission-lines"
import useUsers from "@/use/use-users"

const usersQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: usersTotalCount } = useUsers(usersQuery)

const fundingPeriodsQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: fundingPeriodsTotalCount } = useFundingPeriods(fundingPeriodsQuery)

const fundingSubmissionLinesQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: fundingSubmissionLinesTotalCount } = useFundingSubmissionLines(
  fundingSubmissionLinesQuery
)

const breadcrumbs = [
  {
    title: "Home",
    to: {
      name: "DashboardPage",
    },
  },
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
]
</script>
