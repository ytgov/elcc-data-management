<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card v-if="selectedLine">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Edit Submission Line"
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
        <v-text-field
          v-model="selectedLine.sectionName"
          label="Section"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          v-model="selectedLine.lineName"
          label="Line"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          v-model="selectedLine.fromAge"
          label="From age"
          variant="outlined"
          density="comfortable"
        ></v-text-field>

        <v-text-field
          v-model="selectedLine.toAge"
          label="To age"
          variant="outlined"
          density="comfortable"
        ></v-text-field>

        <v-text-field
          v-model="selectedLine.monthlyAmount"
          label="Monthly amount"
          variant="outlined"
          density="comfortable"
        ></v-text-field>

        <v-text-field
          v-model="selectedLine.fiscalYear"
          label="Fiscal Period"
          readonly
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          @click="saveLine()"
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
import { useSubmissionLinesStore } from "../store"

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useSubmissionLinesStore, ["selectedLine"]),
    visible() {
      return !!this.selectedLine
    },
  },
  methods: {
    ...mapActions(useSubmissionLinesStore, ["unselectLine", "saveLine"]),
    close() {
      this.unselectLine()
    },
  },
}
</script>
