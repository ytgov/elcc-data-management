<template>
  <pre> {{ { centreId, month } }} </pre>
</template>

<script lang="ts" setup>
defineProps({
  centreId: {
    type: String,
    required: true,
  },
  // fiscalYear: { // TODO: add support for this prop
  //   type: String,
  //   required: true,
  // },
  month: {
    type: String,
    required: true,
  },
})
</script>
