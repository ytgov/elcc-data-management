<template>
  <HeaderActionsCard title="Edit Submission Line">
    <FundingSubmissionLineEditForm
      :funding-submission-line-id="fundingSubmissionLineIdAsNumber"
      @updated="redirectToSubmissionLinePage"
    />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingSubmissionLineEditForm from "@/components/funding-submission-lines/FundingSubmissionLineEditForm.vue"

const router = useRouter()

const props = defineProps<{
  fundingSubmissionLineId: string
}>()

const fundingSubmissionLineIdAsNumber = computed(() => parseInt(props.fundingSubmissionLineId))

function redirectToSubmissionLinePage(fundingSubmissionLineId: number) {
  return router.push({
    name: "administration/submission-lines/SubmissionLinePage",
    params: {
      fundingSubmissionLineId,
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
    title: "Submission Lines",
    to: {
      name: "administration/AdministrationSubmissionLinesPage",
    },
  },
  {
    title: "Edit Submission Line",
    to: {
      name: "administration/submission-lines/SubmissionLineEditPage",
      params: {
        fundingSubmissionLineId: props.fundingSubmissionLineId,
      },
    },
  },
]

useBreadcrumbs("Edit Submission Line", breadcrumbs)
</script>
