<template>
  <v-row>
    <v-col>
      <v-card
        :to="{
          name: 'administration/UsersPage',
        }"
      >
        <v-card-title>Users</v-card-title>
        <v-card-text>
          <span class="text-h4">{{ usersTotalCount }}</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :to="{
          name: 'administration/FundingPeriodsPage',
        }"
      >
        <v-card-title>Funding Periods</v-card-title>
        <v-card-text>
          <span class="text-h4">{{ fundingPeriodsTotalCount }}</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :to="{
          name: 'administration/AdministrationSubmissionLinesPage',
        }"
      >
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

import useBreadcrumbs from "@/use/use-breadcrumbs"
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

useBreadcrumbs("Administration", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
])
</script>
