<template>
  <v-text-field
    ref="inputRef"
    type="text"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { useCurrencyInput, type CurrencyInputOptions, CurrencyDisplay } from "vue-currency-input"

const props = defineProps<{
  modelValue: number | null
  options?: Partial<CurrencyInputOptions>
}>()

const emit = defineEmits(["update:modelValue", "change"])

const { inputRef, numberValue } = useCurrencyInput({
  currency: "CAD",
  locale: "en-CA",
  currencyDisplay: CurrencyDisplay.symbol,
  precision: 2,
  // accountingSign: true,
  hideCurrencySymbolOnFocus: false,
  ...props.options,
})

function onBlur() {
  emit("update:modelValue", numberValue.value)
}
</script>
