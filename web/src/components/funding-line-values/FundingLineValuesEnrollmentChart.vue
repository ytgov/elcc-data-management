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
  <div v-else>
    <VueApexCharts
      height="300"
      type="pie"
      :options="options"
      :series="enrollmentChartData"
    ></VueApexCharts>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from "vue"
import VueApexCharts from "vue3-apexcharts"

import useFundingSubmissionLineJsons, {
  type FundingSubmissionLineJsonQueryOptions,
} from "@/use/use-funding-submission-line-jsons"

const props = defineProps<{
  centreId: number
}>()

const fundingSubmissionLineJsonsQuery = computed<FundingSubmissionLineJsonQueryOptions>(() => ({
  where: {
    centreId: props.centreId,
  },
  order: [["dateStart", "DESC"]],
  perPage: 1,
}))
const { fundingSubmissionLineJsons, isLoading } = useFundingSubmissionLineJsons(
  fundingSubmissionLineJsonsQuery
)

const LABELS = [
  "Infants",
  "Toddlers",
  "Preschool",
  "Kindergarten (PT)",
  "Kindergarten (FT)",
  "School Age (PT)",
  "School Age (FT)",
]
const SECTION_NAME = "Child Care Spaces"

const enrollmentChartData = computed(() => {
  return (
    fundingSubmissionLineJsons.value[0]?.lines
      .filter((line) => line.sectionName === SECTION_NAME && LABELS.includes(line.lineName))
      .map(() => 1) ?? []
    // TODO: figure out how to handle "0"
    // .map((line) => line.actualChildOccupancyRate ?? line.estimatedChildOccupancyRate ?? 0) ?? []
  )
})

const skeletonHeight = ref(100)

const options = ref({
  stroke: { show: false },
  colors: ["#0094A9", "#002EB7", "#FFAE00", "#FF7A00", "#04DDFB", "#A65000", "#1851FC"],
  labels: LABELS,
})

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
