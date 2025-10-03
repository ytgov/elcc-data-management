<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff"
  >
    <template #prepend>
      <v-icon
        color="white"
        icon="mdi-home"
      ></v-icon>
    </template>
    <template #divider>
      <v-icon
        color="white"
        icon="mdi-chevron-right"
      ></v-icon>
    </template>
  </v-breadcrumbs>

  <h1>ELCC Home</h1>

  <v-row>
    <v-col cols="4">
      <v-card
        elevation="3"
        color="#DC440566"
        to="/child-care-centres"
      >
        <v-card-text style="text-align: right; color: white">
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px"
            >mdi-school</v-icon
          >

          <div>Education is Currently Funding</div>
          <div style="font-size: 52px; line-height: 52px">{{ centreCount }}</div>
          <div>Child Care Centres</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card
        elevation="3"
        color="#0097a966"
      >
        <v-card-text
          style="text-align: right"
          color="white"
        >
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px"
            >mdi-map</v-icon
          >
          <div>Located In</div>
          <div style="font-size: 52px; line-height: 52px">{{ communityCount }}</div>
          <div>Communities</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card
        elevation="3"
        color="#F2A90066"
      >
        <v-card-text style="text-align: right">
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px"
            >mdi-account-child</v-icon
          >
          <div>Serving</div>
          <div style="font-size: 52px; line-height: 52px">15,514</div>
          <div>Yukon Children</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card
        elevation="3"
        color="#7A9A0166"
      >
        <v-card-text style="text-align: right">
          <VueApexCharts
            width="100%"
            type="bar"
            height="250"
            :options="chartOptions"
            :series="chartSeries"
          ></VueApexCharts>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useCentreStore } from "@/modules/centre/store"
import { mapState } from "pinia"
import VueApexCharts from "vue3-apexcharts"

export default {
  name: "DashboardPage",
  components: { VueApexCharts },
  data: () => ({
    breadcrumbs: [{ title: "Home", disabled: false }],
    chartOptions: {
      chart: {
        id: "vuechart-example",
      },
      xaxis: {
        categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      },
    },
    chartSeries: [
      {
        name: "Enrollment",
        color: "#7A9A01",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  }),
  computed: {
    ...mapState(useCentreStore, ["centreCount", "communityCount"]),
  },
}
</script>
