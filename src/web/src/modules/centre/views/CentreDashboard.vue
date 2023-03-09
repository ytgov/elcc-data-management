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

  <h1 class="mb-4">{{ currentCentre.name }}</h1>

  <v-row v-if="currentCentre && currentCentre.id">
    <v-col cols="12" md="4">
      <v-card elevation="3" color="#F2A90066" class="mb-5">
        <v-card-title style="background-color: #f2a90068">Child Care Centre Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-0">
          <v-list lines="one" density="comfortable" style="background-color: inherit">
            <v-list-item title="License" :subtitle="currentCentre.license" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-file-certificate" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Hot Meal" :subtitle="FormatYesNo(currentCentre.hot_meal)" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-silverware" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Licensed For" :subtitle="currentCentre.licensed_for" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-account-group" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Community" :subtitle="currentCentre.community" class="pl-0">
              <template v-slot:prepend>
                <v-icon icon="mdi-map" style="margin-inline-end: 10px"></v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Last Submission" :subtitle="FormatDate(currentCentre.last_submission)" class="pl-0">
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
          <Enrollment-Chart></Enrollment-Chart>
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
            {{ worksheets }}

            <v-toolbar color="#0097a966" density="compact">
              <v-tabs v-model="month">
                <v-tab :value="worksheet.month" v-for="worksheet of worksheets"> {{ worksheet.month }} </v-tab>
              </v-tabs>
            </v-toolbar>
            <v-btn color="primary" size="small" @click="addWorksheetClick">Add Worksheet</v-btn>

            <v-window v-model="month">
              <v-window-item :value="worksheet.month" v-for="worksheet of worksheets">
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
import { FormatDate, FormatYesNo } from "@/utils";
import { mapActions, mapState } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import MonthlyWorksheet from "../components/MonthlyWorksheet.vue";
import PaymentSummary from "../components/PaymentSummary.vue";
import EnrollmentChart from "../components/EnrollmentChart.vue";
import { ChildCareCentre, useCentreStore } from "../store";

export default {
  setup() {},
  name: "CentreDashboard",
  components: { VueApexCharts, MonthlyWorksheet, PaymentSummary, EnrollmentChart },
  mounted() {
    let centreId = this.$route.params.id;

    if (this.selectedCentre) this.currentCentre = this.selectedCentre;
    else {
      this.selectCentreById(parseInt(centreId as string));
    }

    this.loadWorksheets(parseInt(centreId as string));
  },
  unmounted() {
    this.unselectCentre();
  },
  data() {
    return {
      submissions: [
        { month: "September 2022", payment: "$12,232", enrollment: 43 },
        { month: "October 2022", payment: "$10,134", enrollment: 41 },
        { month: "November 2022", payment: "$11,025", enrollment: 42 },
        { month: "December 2022", payment: "$9,447", enrollment: 39 },
      ],
      tab: 0,
      month: "",
      currentCentre: { name: "" } as ChildCareCentre,

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
  watch: {
    selectedCentre(newVal) {
      this.currentCentre = newVal;
    },
  },
  computed: {
    ...mapState(useCentreStore, ["selectedCentre", "worksheets"]),
    breadcrumbs() {
      return [
        { to: "/dashboard", title: "Home" },
        { to: "/child-care-centres", title: "Child Care Centres" },
        { title: this.currentCentre.name },
      ];
    },
    worksheetMonths() {
      return ["TEST ", "TEST 2"];
    },
  },
  methods: {
    ...mapActions(useCentreStore, ["selectCentreById", "unselectCentre", "loadWorksheets", "createWorksheet"]),
    FormatDate(input: Date) {
      return FormatDate(input);
    },
    FormatYesNo(input: boolean) {
      return FormatYesNo(input);
    },
    addWorksheetClick() {
      this.createWorksheet(this.currentCentre.id);
    },
  },
};
</script>
