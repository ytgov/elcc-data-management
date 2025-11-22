<template>
  <PageLoader v-if="isNil(fundingSubmissionLine)" />
  <HeaderActionsCard
    v-else
    title="Submission Line Details"
  >
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/submission-lines/SubmissionLineEditPage',
          params: {
            fundingSubmissionLineId: props.fundingSubmissionLineId,
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
          :model-value="fundingSubmissionLine.fiscalYear"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Section Name"
          :model-value="fundingSubmissionLine.sectionName"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Line Name"
          :model-value="fundingSubmissionLine.lineName"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Age Range"
          vertical
        >
          {{ fundingSubmissionLine.fromAge }} - {{ fundingSubmissionLine.toAge }}
        </DescriptionElement>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DescriptionElement
          label="Monthly Amount"
          :model-value="fundingSubmissionLine.monthlyAmount"
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
import useFundingSubmissionLine from "@/use/use-funding-submission-line"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import PageLoader from "@/components/common/PageLoader.vue"

const props = defineProps<{
  fundingSubmissionLineId: string
}>()

const fundingSubmissionLineIdAsNumber = computed(() => parseInt(props.fundingSubmissionLineId))

const { fundingSubmissionLine } = useFundingSubmissionLine(fundingSubmissionLineIdAsNumber)

const title = computed(() => fundingSubmissionLine.value?.lineName || "Submission Line")
const lineName = computed(() => fundingSubmissionLine.value?.lineName || "Details")
const breadcrumbs = computed(() => [
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
    title: lineName.value,
    to: {
      name: "administration/submission-lines/SubmissionLinePage",
      params: {
        fundingSubmissionLineId: props.fundingSubmissionLineId,
      },
    },
  },
])

useBreadcrumbs(title, breadcrumbs)
</script>
