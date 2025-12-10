<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
    @keydown.esc="close"
  >
    <v-form
      ref="form"
      v-model="isValid"
      @submit.prevent="updateAndClose"
    >
      <v-card :loading="isLoading">
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
        <v-skeleton-loader
          v-if="isNil(centre)"
          type="card"
        />
        <v-card-text v-else>
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
          <v-text-field
            v-model="centre.licenseHolderName"
            label="License Holder Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.contactName"
            label="Contact Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.physicalAddress"
            label="Physical Address"
            maxlength="250"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.mailingAddress"
            label="Mailing Address"
            maxlength="250"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.email"
            label="Email"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.altEmail"
            label="Alt Email"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.phoneNumber"
            label="Phone Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.altPhoneNumber"
            label="Alt Phone Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.faxNumber"
            label="Fax Number"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.inspectorName"
            label="Inspector Name"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centre.neighborhood"
            label="Neighborhood"
            maxlength="100"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="mx-4 mb-2">
          <v-btn
            :loading="isLoading"
            color="yg-sun"
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
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { isNil } from "lodash"

import { type VForm } from "vuetify/components"

import { integerTransformer } from "@/utils/use-route-query-transformers"
import { required } from "@/utils/validators"

import useCentre from "@/use/use-centre"
import useSnack from "@/use/use-snack"

const emit = defineEmits<{
  saved: [centreId: number]
}>()

const centreId = useRouteQuery<string | null, number | null>("showCentreEdit", null, {
  transform: integerTransformer,
})

const { centre, isLoading, save } = useCentre(centreId)

const form = useTemplateRef("form")
const isValid = ref(false)
const snack = useSnack()

async function updateAndClose() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    if (isNil(centreId.value)) {
      throw new Error("Centre id could not be found")
    }

    await save()

    await nextTick()
    emit("saved", centreId.value)
    snack.success("Centre saved!")

    close()
  } catch (error) {
    console.error(`Failed to save centre ${error}`, { error })
    snack.error(`Failed to save centre ${error}`)
  } finally {
    isLoading.value = false
  }
}

const showDialog = ref(false)

watch(
  centreId,
  (newCentreId) => {
    if (isNil(newCentreId)) {
      showDialog.value = false
      form.value?.resetValidation()
      centre.value = null
    } else {
      centre.value = null
      showDialog.value = true
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

function open(newCentreId: number) {
  centreId.value = newCentreId
}

function close() {
  centreId.value = null
}

defineExpose({
  open,
  close,
})
</script>
