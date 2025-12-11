<template>
  <v-skeleton-loader
    v-if="isNil(fundingRegion)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="validateSaveAndNotify"
  >
    <v-row>
      <v-col cols="12">
        <FundingRegionRegionUniqueTextField
          v-model="fundingRegion.region"
          :excluding-ids="[fundingRegionId]"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="fundingRegion.subsidyRate"
          label="Subsidy Rate *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn
          color="primary"
          :loading="isSaving"
          type="submit"
        >
          Save Changes
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="outlined"
          :to="{
            name: 'administration/funding-regions/FundingRegionPage',
            params: {
              fundingRegionId,
            },
          }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import useFundingRegion from "@/use/use-funding-region"
import useSnack from "@/use/use-snack"

import FundingRegionRegionUniqueTextField from "@/components/funding-regions/FundingRegionRegionUniqueTextField.vue"
import CurrencyInput from "@/components/CurrencyInput.vue"

const props = defineProps<{
  fundingRegionId: number
}>()

const emit = defineEmits<{
  saved: [fundingRegionId: number]
}>()

const { fundingRegionId } = toRefs(props)
const { fundingRegion, save } = useFundingRegion(fundingRegionId)

const isSaving = ref(false)
const snack = useSnack()
const form = useTemplateRef("form")

async function validateSaveAndNotify() {
  if (isNil(fundingRegion.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    await save()
    emit("saved", props.fundingRegionId)
    snack.success("Funding region saved!")
  } catch (error) {
    console.error(`Failed to update funding region: ${error}`, { error })
    snack.error(`Failed to update funding region: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>
