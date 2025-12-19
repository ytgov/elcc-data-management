<template>
  <v-dialog
    v-model="show"
    max-width="900px"
    @esc="close"
  >
    <v-card>
      <div class="d-flex justify-space-between align-center px-4 py-3">
        <h2 class="text-h6 font-weight-bold">Keyboard Shortcuts</h2>
        <v-btn
          icon
          aria-label="Close"
          variant="text"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider />

      <v-card-text class="py-6">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <div class="mb-6">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Navigation</h3>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move down one row</span>
                <v-hotkey
                  keys="enter"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move up one row</span>
                <v-hotkey
                  keys="shift+enter"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move to next column</span>
                <v-hotkey
                  keys="tab"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move to previous column</span>
                <v-hotkey
                  keys="shift+tab"
                  display-mode="text"
                />
              </div>
            </div>

            <v-divider class="my-4" />

            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Arrow Key Navigation</h3>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move up one row</span>
                <v-hotkey
                  keys="arrowup"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move down one row</span>
                <v-hotkey
                  keys="arrowdown"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move left (at start of input)</span>
                <v-hotkey
                  keys="arrowleft"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move right (at end of input)</span>
                <v-hotkey
                  keys="arrowright"
                  display-mode="text"
                />
              </div>

              <div class="text-caption text-medium-emphasis ml-2">
                Arrow keys navigate between cells when cursor is at the edge of the input
              </div>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <div class="mb-6">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Text Selection</h3>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move cursor to start</span>
                <v-hotkey
                  keys="arrowleft"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Move cursor to end</span>
                <v-hotkey
                  keys="arrowright"
                  display-mode="text"
                />
              </div>

              <div class="text-caption text-medium-emphasis ml-2">
                When text is fully selected, arrow keys move the cursor
              </div>
            </div>

            <v-divider class="my-4" />

            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Actions</h3>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Cancel editing & discard changes</span>
                <v-hotkey
                  keys="escape"
                  display-mode="text"
                />
              </div>

              <div class="mb-3 d-flex justify-space-between align-center">
                <span>Show this help</span>
                <v-hotkey
                  keys="shift+?"
                  display-mode="text"
                />
              </div>
            </div>
          </v-col>
        </v-row>

        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          <div class="text-body-2">
            <strong>Tip:</strong> Changes are saved automatically when you navigate to a different
            cell.
          </div>
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
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
