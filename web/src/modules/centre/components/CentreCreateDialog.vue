<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
  >
    <v-form
      ref="form"
      @submit.prevent="validateSaveAndClose"
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
            v-model="centreAttributes.name"
            label="Name *"
            maxlength="200"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <v-text-field
            v-model="centreAttributes.license"
            label="License"
            maxlength="255"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centreAttributes.vendorIdentifier"
            label="Vendor ID"
            maxlength="20"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centreAttributes.licensedFor"
            label="Licensed for"
            variant="outlined"
            density="comfortable"
          />
          <v-checkbox
            v-model="centreAttributes.isFirstNationProgram"
            label="Program Type (FN/non-FN)"
            variant="outlined"
            density="comfortable"
          />
          <v-checkbox
            v-model="centreAttributes.hotMeal"
            label="Hot meal?"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="centreAttributes.community"
            label="Community *"
            maxlength="255"
            :rules="[required]"
            variant="outlined"
            density="comfortable"
            required
          />
          <FundingRegionAutocomplete
            v-model="centreAttributes.fundingRegionId"
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
import { isNil } from "lodash"
import { computed, nextTick, ref, useTemplateRef, watchEffect } from "vue"
import { useRouteQuery } from "@vueuse/router"

import { type VForm } from "vuetify/components"

import { booleanTransformer } from "@/utils/use-route-query-transformers"
import { required } from "@/utils/validators"

import centresApi, { CentreStatuses, type Centre } from "@/api/centres-api"

import FundingRegionAutocomplete from "@/components/funding-regions/FundingRegionAutocomplete.vue"
import useSnack from "@/use/use-snack"
import useFundingRegions from "@/use/use-funding-regions"

const emit = defineEmits<{
  created: [centreId: number]
}>()

const showDialog = useRouteQuery<string, boolean>("showCentreCreate", "false", {
  transform: booleanTransformer,
})

const centreAttributes = ref<Partial<Centre>>({
  fundingRegionId: undefined,
  community: "Whitehorse",
  hotMeal: true,
  isFirstNationProgram: false,
  license: "",
  licensedFor: 10,
  name: "",
  status: CentreStatuses.ACTIVE,
})

const fundingRegionsQuery = computed(() => ({
  where: {
    region: "Whitehorse",
  },
  perPage: 1,
}))
const { fundingRegions } = useFundingRegions(fundingRegionsQuery)
const whitehorseFundingRegion = computed(() => fundingRegions.value[0])

watchEffect(() => {
  centreAttributes.value.fundingRegionId = whitehorseFundingRegion.value?.id
})

const form = useTemplateRef("form")
const isLoading = ref(false)
const snack = useSnack()

async function validateSaveAndClose() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    const { centre } = await centresApi.create(centreAttributes.value)
    close()

    await nextTick()
    emit("created", centre.id)
    snack.success("Centre created!")
  } catch (error) {
    console.error(`Failed to create centre ${error}`, { error })
    snack.error(`Failed to create centre ${error}`)
  } finally {
    isLoading.value = false
  }
}

function reset() {
  centreAttributes.value = {
    fundingRegionId: whitehorseFundingRegion.value?.id,
    community: "Whitehorse",
    hotMeal: true,
    isFirstNationProgram: false,
    license: "",
    licensedFor: 10,
    name: "",
    status: CentreStatuses.ACTIVE,
  }
}

function open() {
  showDialog.value = true
}

function close() {
  showDialog.value = false
  reset()
  form.value?.resetValidation()
}

defineExpose({
  open,
  close,
})
</script>
