<template>
  <!-- Vertical layout -->
  <div v-if="vertical">
    <dt class="d-flex align-center font-weight-medium">
      <v-icon
        v-if="icon"
        size="18"
        class="mr-2"
        aria-hidden="true"
      >
        {{ icon }}
      </v-icon>
      <span>{{ label }}</span>
    </dt>
    <dd class="mt-2">
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="16"
        width="1"
      />
      <slot>{{ modelValue }}</slot>
    </dd>
  </div>

  <!-- Horizontal layout -->
  <div
    v-else
    class="d-flex align-center gap-2"
  >
    <dt class="d-flex align-center font-weight-medium">
      <v-icon
        v-if="icon"
        size="18"
        class="mr-2"
        aria-hidden="true"
      >
        {{ icon }}
      </v-icon>
      <span>{{ label }}:</span>
    </dt>
    <dd>
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="16"
        width="1"
      />
      <slot>{{ modelValue }}</slot>
    </dd>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    icon?: string
    modelValue?: string | number | boolean | null | undefined
    vertical?: boolean
    loading?: boolean
  }>(),
  {
    icon: "",
    modelValue: null,
    vertical: false,
    loading: false,
  }
)
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem; /* 8px */
}
</style>
