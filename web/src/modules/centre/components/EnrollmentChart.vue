<template>
  <div v-if="enrollmentChartLoading">
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
import { getCurrentInstance, onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import VueApexCharts from "vue3-apexcharts"

import { useCentreStore } from "@/modules/centre/store"

const props = defineProps<{
  centreId: number
}>()

const skeletonHeight = ref(100)

const options = ref({
  stroke: { show: false },
  colors: ["#0094A9", "#002EB7", "#FFAE00", "#FF7A00", "#04DDFB", "#A65000", "#1851FC"],
  labels: [
    "Infant",
    "Toddler",
    "Preschool",
    "Kindergarten PT",
    "Kindergarten FT",
    "School Age PT",
    "School Age FT",
  ],
})

const store = useCentreStore()

const { enrollmentChartLoading, enrollmentChartData } = storeToRefs(store)

onMounted(async () => {
  const instance = getCurrentInstance()
  if (instance) {
    const el = instance.proxy?.$el
    skeletonHeight.value = el.offsetWidth / 2
  }

  await store.loadEnrollmentData(props.centreId)
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
