<template>
  <h1 class="text-h5 mb-5">Daily Data Entry</h1>

  <BaseCard showHeader="t" heading="" class="pb-3">
    <template v-slot:left>
      <v-select :items="centres" label="Site" hide-details v-model="site" style="max-width: 220px"></v-select>
    </template>
    <template v-slot:right>
      <v-select v-model="date" label="Date" hide-details style="max-width: 220px"></v-select>
    </template>

    <v-row class="mt-5">
      <v-col cols="6"></v-col>
      <v-col cols="3" class="text-body-1 text-center"> Daily Totals </v-col>
      <v-col cols="3" class="text-body-1 text-center"> Weekly Totals </v-col>
    </v-row>
    <v-row v-for="(location, idx) of origins" :key="idx">
      <v-divider></v-divider>
      <v-col cols="6">
        <div class="text-h6 float-left pt-3">{{ location.name }}</div>
        <div class="float-right">
          <v-btn variant="flat" color="green" icon="" class="mr-3" @click="plusOne(location)">+1</v-btn>
          <v-btn variant="flat" color="green" icon="" class="mr-10" @click="plusFive(location)">+5</v-btn>
          <v-btn variant="flat" color="orange" icon="" class="mr-3" @click="minusOne(location)">-1</v-btn>
          <v-btn variant="flat" color="orange" icon="" class="mr-0" @click="minusFive(location)">-5</v-btn>
        </div>
      </v-col>

      <v-col cols="3" class="text-h6 text-center pt-3">
        <div class="pt-3">{{ location.dailyTotal }}</div>
      </v-col>
      <v-col cols="3" class="text-h6 text-center pt-3">
        <div class="pt-3">{{ location.weeklyTotal }}</div>
      </v-col>
    </v-row>
  </BaseCard>
</template>
<script lang="ts">
import moment from "moment";

export default {
  name: "Dashboard",
  components: {},
  data: () => ({
    total: 0,
    origins: [
      { name: "Yukon", dailyTotal: 0, weeklyTotal: 0 },
      { name: "British Columbia", dailyTotal: 0, weeklyTotal: 0 },
      { name: "Other Canada", dailyTotal: 0, weeklyTotal: 0 },
      { name: "American", dailyTotal: 0, weeklyTotal: 0 },
      { name: "International", dailyTotal: 0, weeklyTotal: 0 },
      { name: "Unknown", dailyTotal: 0, weeklyTotal: 0 },
    ],
    centres: [
      "Airport",
      "Beaver Creek",
      "Carcross",
      "Dawson City",
      "Haines Junction",
      "Old Crow",
      "Watson Lake",
      "Whitehorse",
    ],
    site: "Whitehorse",
    date: "",
  }),
  mounted() {
    this.date = moment().format("YYYY-MM-DD");
  },
  methods: {
    plusOne(location: any) {
      location.dailyTotal++;
      location.weeklyTotal = location.dailyTotal * 5;
    },
    plusFive(location: any) {
      location.dailyTotal += 5;
      location.weeklyTotal = location.dailyTotal * 5;
    },
    minusOne(location: any) {
      location.dailyTotal = Math.max(location.dailyTotal - 1, 0);
      location.weeklyTotal = location.dailyTotal * 5;
    },
    minusFive(location: any) {
      location.dailyTotal = Math.max(location.dailyTotal - 5, 0);
      location.weeklyTotal = location.dailyTotal * 5;
    },
  },
};
</script>
