<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card v-if="editingCentre">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Centre Edit"
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
          v-model="editingCentre.name"
          label="Name"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          v-model="editingCentre.license"
          label="License"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          v-model="editingCentre.licensedFor"
          label="Licensed for"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          v-model="editingCentre.community"
          label="Community"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-checkbox
          v-model="editingCentre.hotMeal"
          label="Hot meal?"
          variant="outlined"
          density="comfortable"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!canSave"
          @click="saveClick"
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
import { mapActions, mapState, mapWritableState } from "pinia"
import { useCentreStore } from "../store"

export default {
  name: "CentreEditor",
  data: () => ({}),
  computed: {
    ...mapState(useCentreStore, ["selectedCentre"]),
    ...mapWritableState(useCentreStore, ["editingCentre"]),
    visible() {
      return !!this.editingCentre
    },
    canSave() {
      return this.editingCentre?.name && this.editingCentre?.community
    },
  },
  methods: {
    ...mapActions(useCentreStore, ["save", "doneEdit"]),
    close() {
      this.doneEdit()
    },
    async saveClick() {
      await this.save()
      if (this.selectedCentre) this.$router.push(`/child-care-centres/${this.selectedCentre.id}`)
    },
  },
}
</script>
