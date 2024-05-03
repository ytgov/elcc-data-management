<template>
  <v-select
    :model-value="modelValue"
    :items="items"
    label="Region"
    @update:model-value="emitModelValue"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { CentreRegions } from "@/api/centres-api"

defineProps<{
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const items = [
  {
    title: "Whitehorse",
    value: CentreRegions.WHITEHORSE,
  },
  {
    title: "Communities",
    value: CentreRegions.COMMUNITIES,
  },
]

function emitModelValue(value: string) {
  emit("update:modelValue", value)
}
</script>
