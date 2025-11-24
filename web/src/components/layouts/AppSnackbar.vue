<template>
  <v-snackbar
    v-model="showSnackbar"
    v-bind="{
      multiLine: true,
      timeout: defaultTimeout,
      ...options,
    }"
  >
    <span :class="`text-${constrastingColor}`">
      {{ message }}
    </span>
    <template #actions>
      <v-btn
        :color="constrastingColor"
        variant="text"
        @click="close"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import { useSnack } from "@/use/use-snack"
import { isEmpty } from "lodash"

const { message, options, reset } = useSnack()

const showSnackbar = ref(false)
const defaultTimeout = 4000

const constrastingColor = computed(() => getContrastingColor(options.value.color))

watch(
  () => [message.value, options.value],
  () => {
    if (isEmpty(message.value)) return

    show()
  },
  { deep: true, immediate: true }
)

watch(
  () => showSnackbar.value,
  (newShowSnackbar) => {
    if (newShowSnackbar === false) {
      reset()
    }
  }
)

function close() {
  showSnackbar.value = false
}

function show() {
  showSnackbar.value = true
}

function getContrastingColor(color: string | undefined) {
  if (color === undefined) return "white"

  const colorMap: {
    [key: string]: "white" | "black" | undefined
  } = {
    primary: "white",
    secondary: "black",
    accent: "black",
    error: "white",
    info: "white",
    success: "white",
    warning: "black",
  }

  return colorMap[color] || "white"
}
</script>
