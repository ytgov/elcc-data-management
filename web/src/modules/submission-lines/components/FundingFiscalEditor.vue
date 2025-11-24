<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card v-if="newFiscalYear">
      <v-toolbar
        color="primary"
        variant="dark"
        title="New Fiscal Year"
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
          v-model="newFiscalYear.fiscalYear"
          label="Fiscal year"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-select
          v-model="newFiscalYear.baseLinesOn"
          label="Base lines on"
          :items="fiscalYears"
          variant="outlined"
          density="comfortable"
        ></v-select>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!canSave"
          @click="createNewFiscal"
          >Save</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="yg-sun"
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
    ...mapState(useSubmissionLinesStore, ["newFiscalYear", "fiscalYears"]),
    visible() {
      return !!this.newFiscalYear
    },
    canSave() {
      return this.newFiscalYear?.fiscalYear && this.newFiscalYear.baseLinesOn
    },
  },
  methods: {
    ...mapActions(useSubmissionLinesStore, ["unselectNewFiscal", "createNewFiscal"]),
    close() {
      this.unselectNewFiscal()
    },
  },
}
</script>
