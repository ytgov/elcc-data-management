<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="newFiscalYear">
      <v-toolbar color="primary" variant="dark" title="New Fiscal Year">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Fiscal year"
          v-model="newFiscalYear.fiscal_year"
          variant="outlined"
          density="comfortable"></v-text-field>
        <v-select
          label="Base lines on"
          :items="fiscalYears"
          v-model="newFiscalYear.base_lines_on"
          variant="outlined"
          density="comfortable"></v-select>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="createNewFiscal" :disabled="!canSave">Save</v-btn>
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
    ...mapState(useSubmissionLinesStore, ["newFiscalYear", "fiscalYears"]),
    visible() {
      return this.newFiscalYear ? true : false;
    },
    canSave() {
      return this.newFiscalYear?.fiscal_year && this.newFiscalYear.base_lines_on;
    },
  },
  methods: {
    ...mapActions(useSubmissionLinesStore, ["unselectNewFiscal", "createNewFiscal"]),
    close() {
      this.unselectNewFiscal();
    },
  },
};
</script>
