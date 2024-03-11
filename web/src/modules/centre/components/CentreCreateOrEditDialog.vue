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
            maxlength="200"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <v-checkbox
            v-model="editingCentre.isFirstNationProgram"
            label="Program Type (FN/non-FN) *"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <v-text-field
            v-model="editingCentre.community"
            label="Community *"
            maxlength="255"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <CentreRegionSelect
            v-model="editingCentre.region"
            label="Region *"
            maxlength="100"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <v-text-field
            v-model="editingCentre.license"
            label="License"
            maxlength="255"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.licensedFor"
            label="Licensed for"
            variant="outlined"
            density="comfortable"
          />
          <v-checkbox
            v-model="editingCentre.hotMeal"
            label="Hot meal?"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.licenseHolderName"
            label="License Holder Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.contactName"
            label="Contact Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.physicalAddress"
            label="Physical Address"
            maxlength="250"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.mailingAddress"
            label="Mailing Address"
            maxlength="250"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.email"
            label="Email"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.altEmail"
            label="Alt Email"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.phoneNumber"
            label="Phone Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.altPhoneNumber"
            label="Alt Phone Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.faxNumber"
            label="Fax Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.vendorIdentifier"
            label="Vendor ID"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.inspectorName"
            label="Inspector Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="editingCentre.neighborhood"
            label="Neighborhood"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
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

import CentreRegionSelect from "@/modules/centre/components/CentreRegionSelect.vue"

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
