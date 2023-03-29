<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="selectedLine">
      <v-toolbar color="primary" variant="dark" title="Edit Submission Line">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
            <v-text-field
              label="Section"
              v-model="selectedLine.section_name"
              variant="outlined"
              density="comfortable"></v-text-field>
            <v-text-field
              label="Line"
              v-model="selectedLine.line_name"
              variant="outlined"
              density="comfortable"></v-text-field>
            <v-text-field
              label="From age"
              v-model="selectedLine.from_age"
              variant="outlined"
              density="comfortable"></v-text-field>

            <v-text-field
              label="To age"
              v-model="selectedLine.to_age"
              variant="outlined"
              density="comfortable"></v-text-field>

            <v-text-field
              label="Monthly amount"
              v-model="selectedLine.monthly_amount"
              variant="outlined"
              density="comfortable"></v-text-field>

            <v-text-field
              label="Fiscal Period"
              v-model="selectedLine.fiscal_year"
              readonly
              variant="outlined"
              density="comfortable"></v-text-field>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveLine()">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useSubmissionLinesStore } from "../store";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useSubmissionLinesStore, ["selectedLine"]),
    visible() {
      return this.selectedLine ? true : false;
    },
  },
  methods: {
    ...mapActions(useSubmissionLinesStore, ["unselectLine", "saveLine"]),
    close() {
      this.unselectLine();
    },
  },
};
</script>
