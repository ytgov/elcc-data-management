<template>
  <v-skeleton-loader
    v-if="isNil(fundingPeriod)"
    type="card"
  />
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
            fundingPeriodId,
          },
        }"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="policy?.destroy"
        class="mt-2 mt-md-0 ml-md-2"
        color="error"
        :loading="isDeleting"
        @click="deleteFundingPeriod(fundingPeriodIdAsNumber)"
      >
        Delete
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
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"

import fundingPeriodsApi from "@/api/funding-periods-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingPeriod from "@/use/use-funding-period"
import useSnack from "@/use/use-snack"

import { formatDate } from "@/utils/formatters"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"

const props = defineProps<{
  fundingPeriodId: string
}>()

const fundingPeriodIdAsNumber = computed(() => parseInt(props.fundingPeriodId))

const { fundingPeriod, policy } = useFundingPeriod(fundingPeriodIdAsNumber)

const isDeleting = ref(false)
const snack = useSnack()
const router = useRouter()

async function deleteFundingPeriod(fundingPeriodId: number) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this funding period?")) return

  isDeleting.value = true
  try {
    await fundingPeriodsApi.delete(fundingPeriodId)
    snack.success("Funding period deleted.")
    return router.push({
      name: "administration/FundingPeriodsPage",
    })
  } catch (error) {
    console.error(`Failed to delete funding period: ${error}`, { error })
    snack.error(`Failed to delete funding period: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

const title = computed(() => fundingPeriod.value?.title || "Funding Period")
const fundingPeriodTitle = computed(() => fundingPeriod.value?.title || "Details")
const formattedFromDate = computed(() => formatDate(fundingPeriod.value?.fromDate))
const formattedToDate = computed(() => formatDate(fundingPeriod.value?.toDate))

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
