<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-skeleton-loader
      v-if="isNil(editingCentre)"
      type="card"
    />
    <v-form
      v-else
      v-model="isValid"
    >
      <v-card>
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
            label="Name *"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
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
            label="Community *"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
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
            color="yg_sun"
            variant="outlined"
            @click="close"
            >Close</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!isValid"
            @click="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import { required } from "@/utils/validators"
import { useCentreStore } from "@/modules/centre/store"

const router = useRouter()
const centreStore = useCentreStore()

const selectedCentre = computed(() => centreStore.selectedCentre)
const editingCentre = computed(() => centreStore.editingCentre)
const visible = computed(() => !!editingCentre.value)

const isValid = ref(false)

function close() {
  centreStore.doneEdit()
}

async function save() {
  await centreStore.save()

  if (selectedCentre.value) {
    router.push({
      name: "CentreDashboardPage",
      params: { centreId: selectedCentre.value.id },
    })
  }
}
</script>
