<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff">
    <template v-slot:prepend>
      <v-icon color="white" icon="mdi-home"></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon color="white" icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <h1 class="mb-4">Michael's Day Home</h1>

  <v-row>
    <v-col cols="12" md="4">
      <v-card elevation="3" color="#F2A90066" class="mb-5">
        <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-0">
          <v-list lines="one" density="comfortable" style="background-color: inherit">
            <v-list-item title="License" subtitle="19-1234" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-file-certificate" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Hot Meal" subtitle="Yes" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-silverware" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Licensed For" subtitle="19" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-account-group" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Community" subtitle="Tagish" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-map" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Last Submission" subtitle="December 2022" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-calendar" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <v-card elevation="3" color="#0097a966">
        <v-card-title style="background-color: #0097a968">Latest Enrollment</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <VueApexCharts height="300" type="pie" :options="options" :series="series"></VueApexCharts>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mb-5 fill-height" elevation="3">
        <v-tabs v-model="tab" grow>
          <v-tab value="option-1"> Summary </v-tab>
          <v-tab value="option-2"> Worksheets </v-tab>
        </v-tabs>
        <v-divider></v-divider>

        <v-window v-model="tab" class="fill-height">
          <v-window-item value="option-1">
            <v-toolbar color="#0097a966" density="compact">
              <v-tabs>
                <v-tab value="0"> Reconciliation </v-tab>
              </v-tabs>
            </v-toolbar>

            <v-card flat>
              <v-card-text>
                <Payment-Summary></Payment-Summary>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="option-2">
            <v-toolbar color="#0097a966" density="compact">
              <v-tabs v-model="month">
                <v-tab value="April 2022"> April 2022 </v-tab>
                <v-tab value="May 2022"> May 2022 </v-tab>
              </v-tabs>
            </v-toolbar>

            <v-window v-model="month">
              <v-window-item value="April 2022">
                <Monthly-Worksheet month="April 2022"></Monthly-Worksheet>
              </v-window-item>
              <v-window-item value="May 2022">
                <Monthly-Worksheet month="May 2022"></Monthly-Worksheet>
              </v-window-item>
            </v-window>

            <!--  <v-carousel show-arrows="top" hide-delimiters :cycle="false">
              <v-carousel-item style="height: 400px !important"> 
            <Monthly-Worksheet month="April 2022"></Monthly-Worksheet>-->
            <!--   </v-carousel-item>
              <v-carousel-item>
                <Monthly-Worksheet month="May 2022"></Monthly-Worksheet>
              </v-carousel-item>
              <v-carousel-item>
                <Monthly-Worksheet month="June  2022"></Monthly-Worksheet>
              </v-carousel-item>
            </v-carousel> -->
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";
import MonthlyWorksheet from "../components/MonthlyWorksheet.vue";
import PaymentSummary from "../components/PaymentSummary.vue";

export default {
  setup() {},
  name: "CentreDashboard",
  components: { VueApexCharts, MonthlyWorksheet, PaymentSummary },
  mounted() {},
  data() {
    return {
      submissions: [
        { month: "September 2022", payment: "$12,232", enrollment: 43 },
        { month: "October 2022", payment: "$10,134", enrollment: 41 },
        { month: "November 2022", payment: "$11,025", enrollment: 42 },
        { month: "December 2022", payment: "$9,447", enrollment: 39 },
      ],
      breadcrumbs: [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
        { title: "Michael's Day Home" },
      ],
      tab: 0,
      month: "",

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
      series: [2, 8, 14, 5, 2, 4, 2],
    };
  },
  methods: {},
};
</script>
