<template>
  <v-skeleton-loader
    v-if="isEmpty(centre)"
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
import { computed, toRefs, useTemplateRef } from "vue"

import { FormatDate as formatDate, FormatYesNo as formatYesNo } from "@/utils"
import useCentre from "@/use/use-centre"

import CentreEditDialog from "@/modules/centre/components/CentreEditDialog.vue"

const props = defineProps<{
  centreId: number
}>()

const { centreId } = toRefs(props)
const { centre } = useCentre(centreId)

const centreDetails = computed<
  {
    title: string
    value: string | number
    icon: string
  }[]
>(() => [
  {
    title: "Licence",
    value: centre.value?.license || "",
    icon: "mdi-file-certificate",
  },
  {
    title: "Hot Meal",
    value: formatYesNo(centre.value?.hotMeal || false),
    icon: "mdi-silverware",
  },
  {
    title: "Licensed For",
    value: centre.value?.licensedFor || "",
    icon: "mdi-account-group",
  },
  {
    title: "Community",
    value: centre.value?.community || "",
    icon: "mdi-map",
  },
  {
    title: "Last Submission",
    value: lastSubmission.value,
    icon: "mdi-calendar",
  },
])
const lastSubmission = computed(() => {
  if (isNil(centre.value) || isNil(centre.value?.lastSubmission)) {
    return "No submision"
  }

  return formatDate(centre.value.lastSubmission)
})

function isLastRow(index: number) {
  return index === centreDetails.value.length - 1
}

const centerEditDialog = useTemplateRef("centerEditDialog")

function showCentreEditDialog() {
  centerEditDialog.value?.open(props.centreId)
}
</script>
