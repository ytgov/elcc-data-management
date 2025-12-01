<template>
  <UniqueTextField
    ref="uniqueTextField"
    v-model="lineName"
    label="Line"
    :check-availability="checkNameAvailability"
    unique-validation-message="Line name must be unique for this fiscal year and section"
    is-unique-message="Line name is available for this fiscal year and section"
    is-not-unique-message="Line name is already taken for this fiscal year and section"
  />
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue"

import fundingSubmissionLinesApi from "@/api/funding-submission-lines-api"

import UniqueTextField from "@/components/common/UniqueTextField.vue"

const lineName = defineModel<string | null | undefined>({
  required: true,
})

const props = defineProps<{
  fiscalYear: string | null | undefined
  sectionName: string | null | undefined
}>()

const whereQuery = computed(() => {
  const baseQuery: Record<string, string> = {}

  if (props.fiscalYear) {
    baseQuery.fiscalYear = props.fiscalYear
  }

  if (props.sectionName) {
    baseQuery.sectionName = props.sectionName
  }

  return baseQuery
})

async function checkNameAvailability(name: string) {
  const { fundingSubmissionLines } = await fundingSubmissionLinesApi.list({
    where: {
      lineName: name,
      ...whereQuery.value,
    },
  })
  return fundingSubmissionLines.length === 0
}

const uniqueTextField = useTemplateRef("uniqueTextField")

watch(
  () => [props.fiscalYear, props.sectionName],
  async () => {
    await uniqueTextField.value?.validate()
  }
)
</script>
