<template>
  <v-date-input
    v-model="date"
    v-bind="$attrs"
    @update:model-value="emitStringResult"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { DateTime } from "luxon"
import { isNil } from "lodash"

/**
 * A date input accepts and returns a string.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    returnFormat?: string
  }>(),
  {
    returnFormat: "yyyy-MM-dd",
  }
)

const emit = defineEmits<{
  "update:modelValue": [value: string | null]
}>()

const date = ref<Date | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (isNil(newValue)) {
      date.value = null
    } else {
      const dateTime = DateTime.fromISO(newValue)
      if (dateTime.isValid) {
        date.value = dateTime.toJSDate()
      } else {
        date.value = null
      }
    }
  },
  {
    immediate: true,
  }
)

/**
 * NOTE: v-date-input returns Date | string, rather than just "string" like it's types imply.
 */
function emitStringResult(value: unknown) {
  if (value instanceof Date) {
    const dateTime = DateTime.fromJSDate(value)
    if (dateTime.isValid) {
      const stringValue = dateTime.toFormat(props.returnFormat)
      emit("update:modelValue", stringValue)
    } else {
      emit("update:modelValue", null)
    }
  } else if (typeof value === "string") {
    emit("update:modelValue", value)
  } else {
    emit("update:modelValue", null)
  }
}
</script>
