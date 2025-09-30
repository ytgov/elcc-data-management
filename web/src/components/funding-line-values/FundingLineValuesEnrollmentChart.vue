<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="image"
  />
  <VueApexCharts
    v-else-if="hasActualChildOccupancyRates"
    height="300"
    type="pie"
    :options="options"
    :series="actualChildOccupancyRates"
  />
  <v-empty-state
    v-else
    text="No enrollment data available"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import VueApexCharts from "vue3-apexcharts"

import useFundingSubmissionLineJsons, {
  type FundingSubmissionLineJsonQueryOptions,
} from "@/use/use-funding-submission-line-jsons"

const props = defineProps<{
  centreId: number
}>()

const SECTION_NAME = "Child Care Spaces"

const fundingSubmissionLineJsonsQuery = computed<FundingSubmissionLineJsonQueryOptions>(() => ({
  where: {
    centreId: props.centreId,
  },
  filters: {
    withChildOccupancyRate: SECTION_NAME,
  },
  order: [["dateStart", "DESC"]],
  perPage: 1,
}))
const { fundingSubmissionLineJsons, isLoading } = useFundingSubmissionLineJsons(
  fundingSubmissionLineJsonsQuery
)

const latestFundingLineValuesForSection = computed(() => {
  const latestFundingSubmissionLineJson = fundingSubmissionLineJsons.value[0]
  if (isNil(latestFundingSubmissionLineJson)) return []

  const { lines } = latestFundingSubmissionLineJson

  return lines.filter((line) => line.sectionName === SECTION_NAME)
})

const lineNames = computed(() =>
  latestFundingLineValuesForSection.value.map((line) => line.lineName)
)
const options = computed(() => ({
  stroke: {
    show: false,
  },
  colors: ["#0094A9", "#002EB7", "#FFAE00", "#FF7A00", "#04DDFB", "#A65000", "#1851FC"],
  labels: lineNames.value,
  tooltip: {
    theme: "light",
    fillSeriesColor: false,
  },
}))

const actualChildOccupancyRates = computed(() => {
  return latestFundingLineValuesForSection.value.map((line) => line.actualChildOccupancyRate)
})

const hasActualChildOccupancyRates = computed(() =>
  actualChildOccupancyRates.value.some((value) => value > 0)
)
</script>
