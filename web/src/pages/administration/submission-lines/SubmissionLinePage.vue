<template>
  <PageLoader v-if="isNil(fundingSubmissionLine)" />
  <v-card v-else>
    <template #title>
      <h3 class="d-flex align-center text-h5">
        Submission Line Details
        <v-spacer />
        <v-btn
          color="primary"
          @click="openEditDialog"
        >
          Edit
        </v-btn>
      </h3>
    </template>

    <template #text>
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
    </template>

    <FundingSubmissionLineEditorDialog ref="fundingSubmissionLineEditorRef" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingSubmissionLine from "@/use/use-funding-submission-line"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import PageLoader from "@/components/common/PageLoader.vue"
import FundingSubmissionLineEditorDialog from "@/components/funding-submission-lines/FundingSubmissionLineEditorDialog.vue"

const props = defineProps<{
  fundingSubmissionLineId: string
}>()

const fundingSubmissionLineIdAsNumber = computed(() => parseInt(props.fundingSubmissionLineId))

const { fundingSubmissionLine } = useFundingSubmissionLine(fundingSubmissionLineIdAsNumber)

const fundingSubmissionLineEditorRef = useTemplateRef("fundingSubmissionLineEditorRef")

function openEditDialog() {
  fundingSubmissionLineEditorRef.value?.open(fundingSubmissionLineIdAsNumber.value)
}

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
