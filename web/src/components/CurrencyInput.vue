<template>
  <!--
    Supress default update:model-value emit, then triggers on blur instead
    This fixes the annoying cursor jump to end bug
  -->
  <v-text-field
    ref="inputRef"
    :model-value="modelValue"
    type="text"
    @blur="onBlur"
    @update:model-value="false"
  />
</template>

<script setup lang="ts">
import { useCurrencyInput, type CurrencyInputOptions } from "vue-currency-input"

const props = defineProps({
  modelValue: Number,
  options: {
    type: Object,
    default: () => ({
      currency: "CAD",
      locale: "en-CA",
      currencyDisplay: "symbol",
      precision: 2,
      // accountingSign: true,
      hideCurrencySymbolOnFocus: false,
    }),
  },
})

const emit = defineEmits(["update:modelValue"])

const autoEmit = false
const { inputRef, numberValue } = useCurrencyInput(props.options as CurrencyInputOptions, autoEmit)

function onBlur() {
  emit("update:modelValue", numberValue.value)
}
</script>
