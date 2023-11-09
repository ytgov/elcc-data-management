<template>
  <v-text-field
    ref="inputRef"
    :model-value="modelValue"
    type="text"
  />
</template>

<script setup lang="ts">
import { useCurrencyInput, type CurrencyInputOptions } from "vue-currency-input"

const props = defineProps({
  modelValue: Number,
  options: {
    type: Object,
    default: () => ({
      currency: "USD",
      precision: 2,
      // accountingSign: true,
      hideCurrencySymbolOnFocus: false,
    }),
  },
})

const { inputRef } = useCurrencyInput(props.options as CurrencyInputOptions)
</script>
