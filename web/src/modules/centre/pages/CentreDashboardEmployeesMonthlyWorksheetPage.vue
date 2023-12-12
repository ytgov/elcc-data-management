<template>
  TODO: some employee stuff like employee benefits

  <pre>
    centreId: {{ centreId }}
    fiscalYearSlug: {{ fiscalYearSlug }}
    month: {{ month }}
  </pre>
</template>

<script lang="ts" setup>
defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalYearSlug: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
})
</script>
