<template>
  <PageLoader v-if="isNil(fundingPeriod)" />
  <HeaderActionsCard
    v-else
    title="Funding Period Details"
  >
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/funding-periods/FundingPeriodEditPage',
          params: {
            fundingPeriodId: props.fundingPeriodId,
          },
        }"
      >
        Edit
      </v-btn>
    </template>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Fiscal Year"
          :model-value="fundingPeriod.fiscalYear"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Title"
          :model-value="fundingPeriod.title"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="From Date"
          :model-value="formattedFromDate"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="To Date"
          :model-value="formattedToDate"
          vertical
        />
      </v-col>
    </v-row>
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingPeriod from "@/use/use-funding-period"

import { formatDate } from "@/utils/formatters"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import PageLoader from "@/components/common/PageLoader.vue"

const props = defineProps<{
  fundingPeriodId: string
}>()

const fundingPeriodIdAsNumber = computed(() => parseInt(props.fundingPeriodId))

const { fundingPeriod } = useFundingPeriod(fundingPeriodIdAsNumber)

const title = computed(() => fundingPeriod.value?.title || "Funding Period")
const fundingPeriodTitle = computed(() => fundingPeriod.value?.title || "Details")
const formattedFromDate = computed(() => {
  if (isNil(fundingPeriod.value?.fromDate)) {
    return ""
  }

  return formatDate(fundingPeriod.value.fromDate)
})
const formattedToDate = computed(() => {
  if (isNil(fundingPeriod.value?.toDate)) {
    return ""
  }

  return formatDate(fundingPeriod.value.toDate)
})
const breadcrumbs = computed(() => [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Funding Periods",
    to: {
      name: "administration/FundingPeriodsPage",
    },
  },
  {
    title: fundingPeriodTitle.value,
    to: {
      name: "administration/funding-periods/FundingPeriodPage",
      params: {
        fundingPeriodId: props.fundingPeriodId,
      },
    },
  },
])

useBreadcrumbs(title, breadcrumbs)
</script>
