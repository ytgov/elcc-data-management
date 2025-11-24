<template>
  <v-card>
    <v-form
      ref="form"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      @submit="emit('submit', $event)"
    >
      <v-card-title class="d-flex flex-column flex-md-row justify-md-space-between align-md-end">
        <slot name="header">
          <component
            :is="headerTag"
            v-if="!isEmpty(title)"
            :class="headerClass"
          >
            {{ title }}
          </component>
        </slot>
        <v-spacer class="mt-4 mt-md-0" />
        <slot name="header-actions"></slot>
      </v-card-title>
      <v-divider :class="dividerClass" />
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions
        v-if="$slots['actions']"
        class="d-flex flex-column flex-md-row"
      >
        <slot name="actions"></slot>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from "vue"
import { isEmpty, isNil } from "lodash"

defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
  headerTag: {
    type: String,
    default: "h3",
    validator(value) {
      if (typeof value !== "string") return false

      return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(value)
    },
  },
  headerClass: {
    type: [String, Object, Array],
    default: "text-h5 mb-0",
  },
  dividerClass: {
    type: [String, Object, Array],
    default: "mb-3",
  },
})

const emit = defineEmits(["update:modelValue", "submit"])

const form = ref(null)

function validate() {
  if (isNil(form.value)) throw new Error("form component not loaded")

  return form.value?.validate()
}

function resetValidation() {
  if (isNil(form.value)) throw new Error("form component not loaded")

  return form.value?.resetValidation()
}

defineExpose({
  validate,
  resetValidation,
})
</script>
