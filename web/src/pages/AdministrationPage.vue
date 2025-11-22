<template>
  <v-row>
    <v-col>
      <v-card
        :loading="isLoadingUsers"
        :to="{
          name: 'administration/UsersPage',
        }"
      >
        <v-card-title>Users</v-card-title>
        <v-card-text>
          <v-progress-circular
            v-if="isLoadingUsers"
            indeterminate
            size="24"
            width="3"
          />
          <span
            v-else
            class="text-h4"
            >{{ usersTotalCount }}</span
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :loading="isLoadingFundingPeriods"
        :to="{
          name: 'administration/FundingPeriodsPage',
        }"
      >
        <v-card-title>Funding Periods</v-card-title>
        <v-card-text>
          <v-progress-circular
            v-if="isLoadingFundingPeriods"
            indeterminate
            size="24"
            width="3"
          />
          <span
            v-else
            class="text-h4"
            >{{ fundingPeriodsTotalCount }}</span
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :loading="isLoadingFundingSubmissionLines"
        :to="{
          name: 'administration/AdministrationSubmissionLinesPage',
        }"
      >
        <v-card-title>Submission Lines</v-card-title>
        <v-card-text>
          <v-progress-circular
            v-if="isLoadingFundingSubmissionLines"
            indeterminate
            size="24"
            width="3"
          />
          <span
            v-else
            class="text-h4"
            >{{ fundingSubmissionLinesTotalCount }}</span
          >
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
const { totalCount: usersTotalCount, isLoading: isLoadingUsers } = useUsers(usersQuery)

const fundingPeriodsQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: fundingPeriodsTotalCount, isLoading: isLoadingFundingPeriods } =
  useFundingPeriods(fundingPeriodsQuery)

const fundingSubmissionLinesQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: fundingSubmissionLinesTotalCount, isLoading: isLoadingFundingSubmissionLines } =
  useFundingSubmissionLines(fundingSubmissionLinesQuery)

useBreadcrumbs("Administration", [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
])
</script>
