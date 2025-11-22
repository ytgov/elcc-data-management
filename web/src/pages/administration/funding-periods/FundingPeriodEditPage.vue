<template>
  <HeaderActionsCard title="Edit Funding Period">
    <FundingPeriodEditForm
      :funding-period-id="fundingPeriodIdAsNumber"
      @updated="redirectToFundingPeriodPage"
    />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingPeriodEditForm from "@/components/funding-periods/FundingPeriodEditForm.vue"

const router = useRouter()

const props = defineProps<{
  fundingPeriodId: string
}>()

const fundingPeriodIdAsNumber = computed(() => parseInt(props.fundingPeriodId))

function redirectToFundingPeriodPage(fundingPeriodId: number) {
  return router.push({
    name: "administration/funding-periods/FundingPeriodPage",
    params: {
      fundingPeriodId,
    },
  })
}

const breadcrumbs = [
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
    title: "Edit",
    to: {
      name: "administration/funding-periods/FundingPeriodEditPage",
      params: {
        fundingPeriodId: props.fundingPeriodId,
      },
    },
  },
]

useBreadcrumbs("Edit", breadcrumbs)
</script>
