<template>
  <v-dialog
    v-model="show"
    max-width="500px"
  >
    <v-card>
      <v-card-title><h2>Keyboard Shortcuts</h2></v-card-title>
      <v-divider class="border-opacity-50" />
      <v-card-text>
        Use keyboard shortcuts to navigate between inputs:
        <ul>
          <li><strong>Enter</strong>: Move down the column</li>
          <li><strong>Shift + Enter</strong>: Move up the column</li>
          <li><strong>Arrow Up</strong>: Move up the column</li>
          <li><strong>Arrow Down</strong>: Move down the column</li>
          <li><strong>Arrow Left</strong> (at start): Move to previous column</li>
          <li><strong>Arrow Right</strong> (at end): Move to next column</li>
          <li><strong>Arrow Left</strong> (text selected): Move to start of input</li>
          <li><strong>Arrow Right</strong> (text selected): Move to end of input</li>
          <li><strong>Ctrl + /</strong>: Show help text</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="close"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const show = ref(false)

function close() {
  show.value = false
}

function open() {
  show.value = true
}

defineExpose({ open })
</script>

<style scoped></style>
