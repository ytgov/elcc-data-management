<template>
  <div v-if="enrollmentChartLoading">
    <v-progress-linear
      indeterminate
      color="#0097a966"
    ></v-progress-linear>
    <div
      class="skeleton"
      id="chartSkeleton"
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

<script lang="ts">
import { mapActions, mapState } from "pinia"
import VueApexCharts from "vue3-apexcharts"
import { useCentreStore } from "../store"

export default {
  setup() {},
  name: "EnrollmentChart",
  components: { VueApexCharts },
  async mounted() {
    this.skeletonHeight = this.$el.offsetWidth / 2
    await this.loadEnrollmentData(parseInt((this.$route.params.id as string) || "0"))
  },
  unmounted() {},
  data() {
    return {
      skeletonHeight: 100,
      options: {
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
      },
    }
  },
  computed: {
    ...mapState(useCentreStore, [
      "selectedCentre",
      "enrollmentChartLoading",
      "enrollmentChartData",
    ]),
  },
  methods: {
    ...mapActions(useCentreStore, ["loadEnrollmentData"]),
  },
}
</script>

<style>
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
