<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card v-if="!isNil(fundingSubmissionLine)">
      <v-toolbar
        color="primary"
        variant="dark"
        title="Edit Submission Line"
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
        <DescriptionElement
          label="Fiscal Period"
          :model-value="fundingSubmissionLine.fiscalYear"
          readonly
          variant="outlined"
          density="comfortable"
        />
        <v-divider class="my-4" />

        <v-text-field
          v-model="fundingSubmissionLine.sectionName"
          label="Section"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="fundingSubmissionLine.lineName"
          label="Line"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="fundingSubmissionLine.fromAge"
          label="From age"
          variant="outlined"
          density="comfortable"
        />

        <v-text-field
          v-model="fundingSubmissionLine.toAge"
          label="To age"
          variant="outlined"
          density="comfortable"
        />

        <v-text-field
          v-model="fundingSubmissionLine.monthlyAmount"
          label="Monthly amount"
          variant="outlined"
          density="comfortable"
        />
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
import useFundingSubmissionLine from "@/use/use-funding-submission-line"

import DescriptionElement from "@/components/common/DescriptionElement.vue"

const fundingSubmissionLineId = useRouteQuery<string | null, number | null>(
  "showFundingSubmissionLineEditor",
  null,
  {
    transform: integerTransformer,
  }
)
const { fundingSubmissionLine, save } = useFundingSubmissionLine(fundingSubmissionLineId)

const visible = ref(false)

function open(newFundingSubmissionLineId: number) {
  fundingSubmissionLineId.value = newFundingSubmissionLineId
  visible.value = true
}

function close() {
  visible.value = false
  fundingSubmissionLineId.value = null
}

const isSaving = ref(false)
const snack = useSnack()

async function saveNotifyAndClose() {
  try {
    isSaving.value = true
    await save()
    snack.success("Submission line saved!")
    close()
  } catch (error) {
    snack.error(`Failed to save submission line: ${error}`)
  } finally {
    isSaving.value = false
  }
}

defineExpose({
  open,
  close,
})
</script>
