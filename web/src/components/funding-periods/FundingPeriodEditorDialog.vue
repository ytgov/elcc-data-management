<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="800"
  >
    <v-card v-if="!isNil(fundingPeriod)">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Edit Funding Period"
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
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="fundingPeriod.title"
              label="Title"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="fundingPeriod.fromDate"
              label="From date"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="fundingPeriod.toDate"
              label="To date"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-divider />

          <v-col cols="12">
            <DescriptionElement
              label="Fiscal year"
              :model-value="fundingPeriod.fiscalYear"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <DescriptionElement
              label="Is fiscal year?"
              :model-value="fundingPeriod.isFiscalYear ? 'Yes' : 'No'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <DescriptionElement
              label="Is school month?"
              :model-value="fundingPeriod.isSchoolMonth ? 'Yes' : 'No'"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn
          color="primary"
          variant="flat"
          :loading="isSaving"
          @click="saveNotifyAndClose"
          >Save</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="yg-sun"
          variant="outlined"
          :loading="isSaving"
          @click="close"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { isNil } from "lodash"
import { useRouteQuery } from "@vueuse/router"

import { integerTransformer } from "@/utils/use-route-query-transformers"

import useSnack from "@/use/use-snack"
import useFundingPeriod from "@/use/use-funding-period"

import DescriptionElement from "@/components/common/DescriptionElement.vue"

const fundingPeriodId = useRouteQuery<string | null, number | null>(
  "showFundingPeriodEditor",
  null,
  {
    transform: integerTransformer,
  }
)
const { fundingPeriod, save } = useFundingPeriod(fundingPeriodId)

const visible = ref(false)

function open(newFundingPeriodId: number) {
  fundingPeriodId.value = newFundingPeriodId
  visible.value = true
}

function close() {
  visible.value = false
  fundingPeriodId.value = null
}

const isSaving = ref(false)
const snack = useSnack()

async function saveNotifyAndClose() {
  try {
    await save()
    snack.success("Funding period saved!")
    close()
  } catch (error) {
    snack.error(`Failed to save funding period: ${error}`)
  } finally {
    isSaving.value = false
  }
}

defineExpose({
  open,
  close,
})
</script>
