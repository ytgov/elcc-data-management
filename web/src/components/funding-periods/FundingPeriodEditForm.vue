<template>
  <v-skeleton-loader
    v-if="isNil(fundingPeriod)"
    type="card"
  />
  <v-form
    v-if="!isNil(fundingPeriod)"
    @submit.prevent="saveAndNotify"
  >
    <v-row>
      <v-col cols="12">
        <DescriptionElement
          label="Fiscal Year"
          :model-value="fundingPeriod.fiscalYear"
          vertical
        />
      </v-col>
    </v-row>
    <v-divider class="my-4" />

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="fundingPeriod.title"
          label="Title"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-date-input
          v-model="fundingPeriod.fromDate"
          label="From Date"
          required
          :rules="[required]"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-date-input
          v-model="fundingPeriod.toDate"
          label="To Date"
          required
          :rules="[required]"
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
            name: 'administration/funding-periods/FundingPeriodPage',
            params: {
              fundingPeriodId,
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
import { ref, toRefs } from "vue"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import useFundingPeriod from "@/use/use-funding-period"
import useSnack from "@/use/use-snack"

import DescriptionElement from "@/components/common/DescriptionElement.vue"

const props = defineProps<{
  fundingPeriodId: number
}>()

const emit = defineEmits<{
  updated: [fundingPeriodId: number]
}>()

const isSaving = ref(false)
const snack = useSnack()

const { fundingPeriodId } = toRefs(props)
const { fundingPeriod, save } = useFundingPeriod(fundingPeriodId)

async function saveAndNotify() {
  if (isNil(fundingPeriod.value)) return

  isSaving.value = true
  try {
    const updatedFundingPeriod = await save()
    emit("updated", updatedFundingPeriod.id)
    snack.success("Funding period updated successfully!")
  } catch (error) {
    console.error(`Failed to update funding period: ${error}`, { error })
    snack.error(`Failed to update funding period: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>
