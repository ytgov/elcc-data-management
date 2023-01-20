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
    <v-col>
      <v-card elevation="3">
        <v-card-text> Current Enrollmenet: 20 

          <p>License: 19-374</p>
          <p>Hot Meal: Yes</p>
          <p>Licensed For: 20</p>


        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="default" elevation="3">
        <v-card-text>
          <h6 class="text-h6">Monthly Submissions</h6>

          <v-data-table
            :headers="[
              { title: 'Month', value: 'month' },
              { title: 'Enrollment', value: 'enrollment' },
              { title: 'Payments', value: 'payment' },
            ]"
            :items="submissions"></v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  setup() {},
  name: "Profile",
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
        {  title: "Michael's Day Home" },
      ],
    };
  },
  methods: {},
};
</script>
