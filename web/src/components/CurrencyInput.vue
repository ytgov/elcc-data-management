<template>
  <v-text-field
    ref="inputRef"
    :model-value="formattedValue"
    type="text"
    @focus="onFocus"
    @blur="onBlur"
    @keydown.escape="resetValue"
    @keydown.enter="onEnter"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useCurrencyInput, type CurrencyInputOptions, CurrencyDisplay } from "vue-currency-input"

const DEFAULT_OPTIONS = {
  currency: "CAD",
  locale: "en-CA",
  currencyDisplay: CurrencyDisplay.symbol,
  precision: 2,
  // accountingSign: true,
  hideCurrencySymbolOnFocus: true,
}

const props = defineProps<{
  modelValue: number | null
  options?: Partial<CurrencyInputOptions>
}>()

const initialNumberValue = ref(props.modelValue)
const emit = defineEmits(["update:modelValue"])

const { inputRef, numberValue, setValue, setOptions, formattedValue } = useCurrencyInput(
  {
    ...DEFAULT_OPTIONS,
    ...props.options,
  },
  false
)

watch(
  () => props.modelValue,
  (value) => {
    setValue(value)
  }
)

watch(
  () => props.options,
  (options) => {
    setOptions({
      ...DEFAULT_OPTIONS,
      ...options,
    })
  }
)

function onFocus() {
  initialNumberValue.value = numberValue.value
}

async function onBlur() {
  if (numberValue.value === null) {
    resetValue()
  } else {
    emit("update:modelValue", numberValue.value)
  }
}

function onEnter() {
  emit("update:modelValue", numberValue.value)
}

function resetValue() {
  setValue(initialNumberValue.value)
  emit("update:modelValue", initialNumberValue.value)
}
</script>
