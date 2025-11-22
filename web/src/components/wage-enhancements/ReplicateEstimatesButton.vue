<template>
  <v-btn
    :loading="loading || isReplicatingEstimates"
    color="yg-sun"
    size="small"
    @click="replicateEstimatesForward"
  >
    <v-icon start>mdi-content-copy</v-icon> Replicate Estimates
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue"

import wageEnhancementsApi from "@/api/wage-enhancements-api"
import { useNotificationStore } from "@/store/NotificationStore"

const props = defineProps({
  centreId: {
    type: Number,
    required: true,
  },
  fiscalPeriodId: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const notificationStore = useNotificationStore()
const isReplicatingEstimates = ref(false)

async function replicateEstimatesForward() {
  isReplicatingEstimates.value = true
  try {
    await wageEnhancementsApi.replicateEstimates({
      centreId: props.centreId,
      fiscalPeriodId: props.fiscalPeriodId,
    })
    notificationStore.notify({
      text: "Wage enhancement estimates replicated forward",
      variant: "success",
    })
  } catch (error) {
    notificationStore.notify({
      text: `Failed to replicate wage enhancement estimates: ${error}`,
      variant: "error",
    })
  } finally {
    isReplicatingEstimates.value = false
  }
}
</script>
