<template>
  <v-card>
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
  </v-card>
</template>

<script setup>
import { isEmpty } from "lodash"

defineProps({
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
</script>
