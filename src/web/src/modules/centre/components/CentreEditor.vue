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
          @click="close"
          color="white"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Name"
          v-model="editingCentre.name"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          label="License"
          v-model="editingCentre.license"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          label="Licensed for"
          v-model="editingCentre.licensed_for"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-text-field
          label="Community"
          v-model="editingCentre.community"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
        <v-checkbox
          label="Hot meal?"
          v-model="editingCentre.hot_meal"
          variant="outlined"
          density="comfortable"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          @click="saveClick"
          :disabled="!canSave"
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
