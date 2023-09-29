<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="800"
  >
    <v-card v-if="selectedPeriod">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Edit Funding Period"
      >
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="white"
          @click="close"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="selectedPeriod.fiscalYear"
              label="Fiscal year"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
            <v-text-field
              v-model="selectedPeriod.title"
              label="Title"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
            <v-text-field
              v-model="selectedPeriod.fromDate"
              label="From date"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-text-field
              v-model="selectedPeriod.toDate"
              label="To date"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-checkbox
              v-model="selectedPeriod.isFiscalYear"
              label="Is fiscal year"
              variant="outlined"
              density="comfortable"
            ></v-checkbox>

            <v-checkbox
              v-model="selectedPeriod.isSchoolMonth"
              label="Is school month"
              variant="outlined"
              density="comfortable"
            ></v-checkbox>
          </v-col>
          <v-divider
            vertical
            thickness="1"
          ></v-divider>
          <v-col
            cols="12"
            md="6"
          >
            <h3>Permissions</h3>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          @click="savePeriod()"
          >Save</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="yg_sun"
          variant="outlined"
          @click="close"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia"
import { useFundingPeriodStore } from "../store/FundingPeriod"

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useFundingPeriodStore, ["selectedPeriod"]),
    visible() {
      return !!this.selectedPeriod
    },
  },
  methods: {
    ...mapActions(useFundingPeriodStore, ["unselectPeriod", "savePeriod"]),
    close() {
      this.unselectPeriod()
    },
  },
}
</script>
