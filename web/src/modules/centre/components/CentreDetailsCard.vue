<template>
  <v-skeleton-loader
    v-if="isEmpty(selectedCentre)"
    type="card"
  />
  <v-card
    v-else
    elevation="3"
    color="#F2A90066"
    class="mb-5"
  >
    <v-card-title style="background-color: #f2a90068">
      <v-btn
        icon="mdi-pencil"
        title="Edit"
        size="x-small"
        color="primary"
        class="float-right my-0"
        @click="startEdit"
      ></v-btn>
      Child Care Centre Details
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pt-0">
      <v-list
        lines="one"
        density="comfortable"
        style="background-color: inherit"
      >
        <v-list-item
          title="License"
          :subtitle="selectedCentre.license || ''"
          class="pl-0"
        >
          <template #prepend>
            <v-icon
              icon="mdi-file-certificate"
              style="margin-inline-end: 10px"
            ></v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          title="Hot Meal"
          :subtitle="formatYesNo(selectedCentre.hotMeal || false)"
          class="pl-0"
        >
          <template #prepend>
            <v-icon
              icon="mdi-silverware"
              style="margin-inline-end: 10px"
            ></v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          title="Licensed For"
          :subtitle="selectedCentre.licensedFor || ''"
          class="pl-0"
        >
          <template #prepend>
            <v-icon
              icon="mdi-account-group"
              style="margin-inline-end: 10px"
            ></v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          title="Community"
          :subtitle="selectedCentre.community"
          class="pl-0"
        >
          <template #prepend>
            <v-icon
              icon="mdi-map"
              style="margin-inline-end: 10px"
            ></v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          title="Last Submission"
          :subtitle="formatDate(selectedCentre.lastSubmission)"
          class="pl-0"
        >
          <template #prepend>
            <v-icon
              icon="mdi-calendar"
              style="margin-inline-end: 10px"
            ></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { storeToRefs } from "pinia"

import { FormatDate, FormatYesNo } from "@/utils"
import { useCentreStore } from "@/modules/centre/store"

const store = useCentreStore()

const { selectedCentre } = storeToRefs(store)

function startEdit() {
  if (isNil(selectedCentre.value)) {
    throw new Error("No centre selected")
  }

  store.editCentre(selectedCentre.value)
}

function formatDate(input: Date | string | null | undefined) {
  return input != null ? FormatDate(input) : ""
}

function formatYesNo(input: boolean) {
  return FormatYesNo(input)
}
</script>
