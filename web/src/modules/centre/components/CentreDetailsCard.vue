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
        @click="showCentreEditDialog"
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
        <template
          v-for="({ title, value, icon }, index) in centreDetails"
          :key="title"
        >
          <v-list-item
            :title="title"
            :subtitle="value"
            :prepend-icon="icon"
          />
          <v-divider v-if="!isLastRow(index)" />
        </template>
      </v-list>
    </v-card-text>

    <CentreEditDialog ref="centerEditDialog" />
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

import { FormatDate as formatDate, FormatYesNo as formatYesNo } from "@/utils"
import { Centre, useCentreStore } from "@/modules/centre/store"

import CentreEditDialog from "@/modules/centre/components/CentreEditDialog.vue"
import { useRoute } from "vue-router"

type CentreEditDialogInstance = InstanceType<typeof CentreEditDialog> | null

const store = useCentreStore()

const { selectedCentre } = storeToRefs(store)
const centerEditDialog = ref<CentreEditDialogInstance>(null)

const centreDetails = computed<
  {
    title: string
    value: string | number
    icon: string
  }[]
>(() => [
  {
    title: "Licence",
    value: selectedCentre.value?.license || "",
    icon: "mdi-file-certificate",
  },
  {
    title: "Hot Meal",
    value: formatYesNo(selectedCentre.value?.hotMeal || false),
    icon: "mdi-silverware",
  },
  {
    title: "Licensed For",
    value: selectedCentre.value?.licensedFor || "",
    icon: "mdi-account-group",
  },
  {
    title: "Community",
    value: selectedCentre.value?.community || "",
    icon: "mdi-map",
  },
  {
    title: "Last Submission",
    value: formatDate(selectedCentre.value?.lastSubmission || ""),
    icon: "mdi-calendar",
  },
])

const route = useRoute()

watch<[Centre | undefined, CentreEditDialogInstance], true>(
  () => [selectedCentre.value, centerEditDialog.value],
  ([newSelectedCentre, newCenterEditDialog]) => {
    if (
      !isNil(newSelectedCentre) &&
      !isNil(newCenterEditDialog) &&
      route.query.showCentreEdit === "true"
    ) {
      centerEditDialog.value?.show(newSelectedCentre)
    }
  },
  {
    immediate: true,
  }
)

function isLastRow(index: number) {
  return index === centreDetails.value.length - 1
}

function showCentreEditDialog() {
  if (isNil(selectedCentre.value)) {
    throw new Error("Selected centre is missing")
  }

  centerEditDialog.value?.show(selectedCentre.value)
}
</script>
