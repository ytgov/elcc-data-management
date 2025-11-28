<template>
  <v-combobox
    :model-value="modelValue"
    :items="sectionNames"
    label="Section"
    :loading="isLoading"
    chips
    @update:model-value="updateModelValue"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"

import useSectionNames, {
  type SectionNamesWhereOptions,
} from "@/use/funding-submission-lines/use-section-names"

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    where?: SectionNamesWhereOptions
  }>(),
  {
    where: () => ({}),
  }
)

const emit = defineEmits(["update:modelValue"])

const sectionNamesQuery = computed(() => {
  return {
    where: props.where,
  }
})
const { sectionNames, isLoading } = useSectionNames(sectionNamesQuery)

function updateModelValue(value: string) {
  emit("update:modelValue", value)
}
</script>
