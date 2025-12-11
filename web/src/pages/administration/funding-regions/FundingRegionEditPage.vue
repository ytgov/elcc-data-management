<template>
  <HeaderActionsCard title="Edit Funding Region">
    <FundingRegionEditForm
      :funding-region-id="fundingRegionIdAsNumber"
      @saved="redirectToFundingRegionPage"
    />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingRegionEditForm from "@/components/funding-regions/FundingRegionEditForm.vue"

const router = useRouter()

const props = defineProps<{
  fundingRegionId: string
}>()

const fundingRegionIdAsNumber = computed(() => parseInt(props.fundingRegionId))

function redirectToFundingRegionPage(fundingRegionId: number) {
  return router.push({
    name: "administration/funding-regions/FundingRegionPage",
    params: {
      fundingRegionId,
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
    title: "Funding Regions",
    to: {
      name: "administration/FundingRegionsPage",
    },
  },
  {
    title: "Edit",
    to: {
      name: "administration/funding-regions/FundingRegionEditPage",
      params: {
        fundingRegionId: props.fundingRegionId,
      },
    },
  },
]

useBreadcrumbs("Edit", breadcrumbs)
</script>
