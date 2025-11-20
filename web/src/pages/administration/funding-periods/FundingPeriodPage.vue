<template>
  <PageLoader v-if="isNil(fundingPeriod)" />
  <v-card v-else>
    <template #title>
      <h3 class="d-flex align-center text-h5">
        Funding Period Details
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
            :model-value="fundingPeriod.fromDate"
            vertical
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <DescriptionElement
            label="To Date"
            :model-value="fundingPeriod.toDate"
            vertical
          />
        </v-col>
      </v-row>
    </template>

    <FundingPeriodEditorDialog ref="fundingPeriodEditorRef" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useFundingPeriod from "@/use/use-funding-period"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import PageLoader from "@/components/common/PageLoader.vue"
import FundingPeriodEditorDialog from "@/components/funding-periods/FundingPeriodEditorDialog.vue"

const props = defineProps<{
  fundingPeriodId: string
}>()

const fundingPeriodIdAsNumber = computed(() => parseInt(props.fundingPeriodId))

const { fundingPeriod } = useFundingPeriod(fundingPeriodIdAsNumber)

const fundingPeriodEditorRef = useTemplateRef("fundingPeriodEditorRef")

function openEditDialog() {
  fundingPeriodEditorRef.value?.open(fundingPeriodIdAsNumber.value)
}

const title = computed(() => fundingPeriod.value?.title || "Funding Period")
const fundingPeriodTitle = computed(() => fundingPeriod.value?.title || "Details")
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
