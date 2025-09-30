<template>
  <div v-if="isLoading">
    <v-progress-linear
      indeterminate
      color="#0097a966"
    ></v-progress-linear>
    <div
      class="skeleton"
      :style="{
        'min-height': `${skeletonHeight}px`,
      }"
    ></div>
  </div>
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
import { computed, getCurrentInstance, onMounted, ref } from "vue"
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
}))

const actualChildOccupancyRates = computed(() => {
  return latestFundingLineValuesForSection.value.map((line) => line.actualChildOccupancyRate)
})

const hasActualChildOccupancyRates = computed(() =>
  actualChildOccupancyRates.value.some((value) => value > 0)
)

const skeletonHeight = ref(100)

onMounted(async () => {
  const instance = getCurrentInstance()
  if (instance) {
    const el = instance.proxy?.$el
    skeletonHeight.value = el.offsetWidth / 2
  }
})
</script>

<style scoped>
@keyframes skeleton-pulse {
  0% {
    background-color: #ffffff00;
  }
  50% {
    background-color: #ffffff44;
  }
  110% {
    background-color: #ffffff00;
  }
}

.skeleton {
  animation: skeleton-pulse 3s infinite;
  border: 1px #ffffff44 solid;
  padding: 15px;
}
</style>
