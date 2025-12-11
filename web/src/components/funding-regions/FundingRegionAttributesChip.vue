<template>
  <v-chip
    variant="tonal"
    color="secondary"
    :size="size"
  >
    {{ startCase(fundingRegion.region) }}
  </v-chip>
</template>

<script setup lang="ts">
import { startCase } from "lodash"
import { type VChip } from "vuetify/components"

import { type FundingRegion } from "@/api/funding-regions-api"

withDefaults(
  defineProps<{
    fundingRegion: FundingRegion
    size?: VChip["size"]
  }>(),
  {
    size: "small",
  }
)
</script>
