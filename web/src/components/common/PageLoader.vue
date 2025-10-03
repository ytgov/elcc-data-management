<template>
  <div class="d-flex justify-center align-center h-screen">
    <div class="d-flex flex-column align-center">
      <v-progress-circular
        indeterminate
        size="64"
        class="mb-5"
        color="yg-moss"
      />
      <h1 class="text-center">{{ message }}</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    default: "Loading ELCC Data Management ...",
  },
})
</script>
