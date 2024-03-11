<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
  >
    <v-form
      ref="form"
      v-model="isValid"
      @submit.prevent="createAndClose"
    >
      <v-card :loading="isLoading">
        <v-toolbar
          color="primary"
          variant="dark"
          title="Create Centre"
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
            v-model="centre.name"
            label="Name *"
            maxlength="200"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <v-text-field
            v-model="centre.license"
            label="License"
            maxlength="255"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.vendorIdentifier"
            label="Vendor ID"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.licensedFor"
            label="Licensed for"
            variant="outlined"
            density="comfortable"
          />
          <v-checkbox
            v-model="centre.isFirstNationProgram"
            label="Program Type (FN/non-FN)"
            variant="outlined"
            density="comfortable"
          />
          <v-checkbox
            v-model="centre.hotMeal"
            label="Hot meal?"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.community"
            label="Community *"
            maxlength="255"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <CentreRegionSelect
            v-model="centre.region"
            label="Region *"
            maxlength="100"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
        </v-card-text>
        <v-card-actions class="mx-4 mb-2">
          <v-btn
            :loading="isLoading"
            color="yg_sun"
            variant="outlined"
            @click="close"
            >Close</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            variant="flat"
            :disabled="!isValid"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { cloneDeep, isEmpty } from "lodash"
import { nextTick, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import centresApi from "@/api/centres-api"
import { Centre, useCentreStore } from "@/modules/centre/store"
import { useNotificationStore } from "@/store/NotificationStore"

import CentreRegionSelect from "@/modules/centre/components/CentreRegionSelect.vue"

const emit = defineEmits(["saved"])

const centreStore = useCentreStore()
const notificationStore = useNotificationStore()
const router = useRouter()
const route = useRoute()

const centre = ref<Partial<Centre>>({})

const showDialog = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)
const isLoading = ref(false)
const isValid = ref(false)

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      if (route.query.showCentreCreate === "true") {
        return
      }

      router.push({ query: { showCentreCreate: "true" } })
    } else {
      router.push({ query: { showCentreCreate: undefined } })
    }
  }
)

function show(newCentre: Centre) {
  centre.value = cloneDeep(newCentre)
  showDialog.value = true
}

function close() {
  showDialog.value = false
  resetCentre()
  form.value?.resetValidation()
}

async function createAndClose() {
  if (!isValid.value) {
    notificationStore.notify({
      text: "Please fill out all required fields",
      color: "error",
    })
    return
  }

  isLoading.value = true
  try {
    if (isEmpty(centre.value)) {
      throw new Error("Centre needs some data to save!")
    }

    const { centre: newCentre } = await centresApi.create(centre.value)
    centreStore.selectCentre(newCentre)
    close()

    await nextTick()
    emit("saved", newCentre.id)
    notificationStore.notify({
      text: "Centre saved",
      color: "success",
    })
  } catch (error) {
    notificationStore.notify({
      text: `Failed to save centre ${error}`,
      color: "error",
    })
  } finally {
    isLoading.value = false
  }
}

function resetCentre() {
  centre.value = {}
}

defineExpose({
  show,
})
</script>
