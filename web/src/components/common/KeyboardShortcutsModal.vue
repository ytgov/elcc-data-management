<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    @esc="close"
  >
    <v-card>
      <div class="d-flex justify-space-between align-center px-4 py-3">
        <h2 class="text-h6 font-weight-bold">Keyboard shortcuts</h2>
        <v-btn
          icon
          aria-label="Close"
          variant="outlined"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider class="border-opacity-50" />

      <v-card-text class="py-4">
        <v-row>
          <v-col cols="6">
            <div class="mb-3 d-flex justify-space-between">
              <span>Move down the column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Enter</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>Move up the column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Shift</v-chip
                >
                <v-chip
                  variant="outlined"
                  label
                  small
                  class="ml-2"
                  >Enter</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>Move up the column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Up</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>Move down the column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Down</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>Move to left column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Left</v-chip
                >
              </div>
            </div>
          </v-col>

          <v-col cols="6">
            <div class="mb-3 d-flex justify-space-between">
              <span>Move to right column</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Right</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>(text selected) Move to start of input</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Left</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>(text selected) Move to end of input</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Arrow Right</v-chip
                >
              </div>
            </div>

            <div class="mb-3 d-flex justify-space-between">
              <span>Show help text</span>
              <div>
                <v-chip
                  variant="outlined"
                  label
                  small
                  >Ctrl</v-chip
                >
                <v-chip
                  variant="outlined"
                  label
                  small
                  class="ml-2"
                  >/</v-chip
                >
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router"

import { booleanTransformer } from "@/utils/use-route-query-transformers"

const show = useRouteQuery<string, boolean>("showKeyboardShortcuts", "false", {
  transform: booleanTransformer,
})

function close() {
  show.value = false
}

function open() {
  show.value = true
}

defineExpose({
  open,
})
</script>
