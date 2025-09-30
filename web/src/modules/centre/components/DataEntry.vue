<template>
  <h1 class="text-h5 mb-5">Child Care Centres</h1>

  <BaseCard
    show-header="t"
    heading=""
    class="pb-3"
  >
    <template #left>
      <v-text-field
        v-model="search"
        label="Search"
        hide-details
      ></v-text-field>
    </template>
    <template #right>
      <v-btn
        variant="flat"
        color="primary"
        >Add Centre</v-btn
      >
    </template>

    <router-link to="/child-care-centres">View all</router-link>

    <v-row class="mt-4">
      <v-col>
        <v-card
          elevation="3"
          to="/child-care-centres/12345"
        >
          <v-card-text>
            <h4 class="text-h6">Michael's Day Home</h4>
            <v-divider class="mb-2 mt-2"></v-divider>
            <p>Current Enrollment: 24</p>
            <p></p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card elevation="3">
          <v-card-text> Michael's Day Home </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card elevation="3">
          <v-card-text> Michael's Day Home </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </BaseCard>
</template>
<script lang="ts">
import moment from "moment" // TODO: deprecated; replace with luxon

import BaseCard from "@/components/BaseCard.vue"

export default {
  name: "DataEntry",
  components: {
    BaseCard,
  },
  data: () => ({
    total: 0,
    search: "",
    site: "Whitehorse",
    date: "",
  }),
  mounted() {
    this.date = moment().format("YYYY-MM-DD")

    // let t: CareCentre = { name: "Mi", id: 213, location: "Home" };
  },
  methods: {
    plusOne(location: any) {
      location.dailyTotal++
      location.weeklyTotal = location.dailyTotal * 5
    },
    plusFive(location: any) {
      location.dailyTotal += 5
      location.weeklyTotal = location.dailyTotal * 5
    },
    minusOne(location: any) {
      location.dailyTotal = Math.max(location.dailyTotal - 1, 0)
      location.weeklyTotal = location.dailyTotal * 5
    },
    minusFive(location: any) {
      location.dailyTotal = Math.max(location.dailyTotal - 5, 0)
      location.weeklyTotal = location.dailyTotal * 5
    },
  },
}
</script>
