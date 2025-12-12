<template>
  <UniqueTextField
    v-model="region"
    label="Region"
    :check-availability="checkRegionAvailability"
    unique-validation-message="Region name must be unique"
    is-unique-message="Region name is available"
    is-not-unique-message="Region name is already taken"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isEmpty } from "lodash"

import fundingRegionsApi from "@/api/funding-regions-api"

import UniqueTextField from "@/components/common/UniqueTextField.vue"

const region = defineModel<string | null | undefined>({
  required: true,
})

const props = withDefaults(
  defineProps<{
    excludingIds?: number[]
  }>(),
  {
    excludingIds: () => [],
  }
)

const filters = computed(() => {
  if (isEmpty(props.excludingIds)) return {}

  return {
    excludingIds: props.excludingIds,
  }
})

async function checkRegionAvailability(name: string) {
  const { fundingRegions } = await fundingRegionsApi.list({
    where: {
      region: name,
    },
    filters: filters.value,
  })
  return fundingRegions.length === 0
}
</script>
