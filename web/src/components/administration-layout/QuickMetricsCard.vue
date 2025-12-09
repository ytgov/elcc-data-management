<template>
  <v-card>
    <v-card-title>
      <h2 class="text-h5 title mb-1">Quick Metrics Overview</h2>
      <v-card-text>
        <v-data-table
          :items="items"
          :loading="isLoading"
          hide-default-header
          hide-default-footer
          @dblclick:row="goToResourcePage"
        >
          <template #item.actions="{ value }">
            <v-btn
              :to="value.to"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-eye"
            >
              View
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useFundingPeriods from "@/use/use-funding-periods"
import useFundingRegions from "@/use/use-funding-regions"
import useFundingSubmissionLines from "@/use/use-funding-submission-lines"
import useUsers from "@/use/use-users"

type QuickMetricsTableItem = {
  title: string
  count: number
  actions: {
    to: {
      name: string
    }
  }
}

const items = computed<QuickMetricsTableItem[]>(() => [
  {
    title: "Users",
    count: totalCountUsers.value,
    actions: {
      to: {
        name: "administration/UsersPage",
      },
    },
  },
  {
    title: "Funding Periods",
    count: totalCountFundingPeriods.value,
    actions: {
      to: {
        name: "administration/FundingPeriodsPage",
      },
    },
  },
  {
    title: "Funding Regions",
    count: totalCountFundingRegions.value,
    actions: {
      to: {
        name: "administration/FundingRegionsPage",
      },
    },
  },
  {
    title: "Submission Lines",
    count: totalCountFundingSubmissionLines.value,
    actions: {
      to: {
        name: "administration/AdministrationSubmissionLinesPage",
      },
    },
  },
])

type QuickMetricsTableRow = {
  item: QuickMetricsTableItem
}

const router = useRouter()

function goToResourcePage(_event: unknown, { item }: QuickMetricsTableRow) {
  router.push(item.actions.to)
}

const usersQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: totalCountUsers, isLoading: isLoadingUsers } = useUsers(usersQuery)

const fundingPeriodsQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: totalCountFundingPeriods, isLoading: isLoadingFundingPeriods } =
  useFundingPeriods(fundingPeriodsQuery)

const fundingRegionsQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: totalCountFundingRegions, isLoading: isLoadingFundingRegions } =
  useFundingRegions(fundingRegionsQuery)

const fundingSubmissionLinesQuery = computed(() => ({
  perPage: 1,
}))
const { totalCount: totalCountFundingSubmissionLines, isLoading: isLoadingFundingSubmissionLines } =
  useFundingSubmissionLines(fundingSubmissionLinesQuery)

const isLoading = computed(() => {
  return (
    isLoadingUsers.value ||
    isLoadingFundingPeriods.value ||
    isLoadingFundingRegions.value ||
    isLoadingFundingSubmissionLines.value
  )
})
</script>
