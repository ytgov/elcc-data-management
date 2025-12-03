<template>
  <v-text-field
    ref="textField"
    :model-value="modelValue"
    :label="label"
    :rules="[...rules, valueMustBeUnique]"
    @update:model-value="updateModelValue"
  >
    <template #append-inner>
      <v-icon
        v-if="isNil(isUniqueValue)"
        :title="uniqueValidationMessage"
        >mdi-progress-clock</v-icon
      >
      <v-progress-circular
        v-else-if="isCheckingUniqueness"
        size="18"
        width="2"
        indeterminate
        color="primary"
      />
      <v-icon
        v-else-if="isUniqueValue === true"
        :title="isUniqueMessage"
        color="success"
        >mdi-check-circle-outline</v-icon
      >
      <v-icon
        v-else
        color="warning"
        :title="isNotUniqueMessage"
        >mdi-alert-circle-outline</v-icon
      >
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { debounce, isEmpty, isNil } from "lodash"

import { type VTextField } from "vuetify/components"

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    label: string
    checkAvailability: (value: string) => Promise<boolean>
    rules?: VTextField["rules"]
    uniqueValidationMessage?: string
    isUniqueMessage?: string
    isNotUniqueMessage?: string
  }>(),
  {
    rules: () => [],
    uniqueValidationMessage: "Value must be unique",
    isUniqueMessage: "Value is unique",
    isNotUniqueMessage: "Value is not unique",
  }
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const isUniqueValue = ref<boolean | null>(null)
const isCheckingUniqueness = ref(false)
const textField = ref<InstanceType<typeof VTextField> | null>(null)

async function updateModelValue(value: string) {
  emit("update:modelValue", value)

  await debouncedCheckValueIsUnique(value)
}

async function checkValueIsUnique(value: string | null | undefined) {
  if (isNil(value) || isEmpty(value)) return null

  isCheckingUniqueness.value = true
  try {
    const result = await props.checkAvailability(value)
    isUniqueValue.value = result
    await textField.value?.validate(false)
    return result
  } catch (error) {
    console.error(error)
    return false
  } finally {
    isCheckingUniqueness.value = false
  }
}

const debouncedCheckValueIsUnique = debounce(checkValueIsUnique, 500)

function valueMustBeUnique() {
  if (isUniqueValue.value === true || isUniqueValue.value === null) return true

  return props.uniqueValidationMessage
}

defineExpose({
  validate: () => checkValueIsUnique(props.modelValue),
})
</script>
