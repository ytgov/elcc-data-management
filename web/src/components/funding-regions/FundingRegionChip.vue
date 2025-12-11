<template>
  <v-chip
    v-if="isNil(fundingRegion)"
    variant="tonal"
    color="secondary"
    :size="size"
  >
    Loading...
  </v-chip>
  <v-chip
    v-else
    variant="tonal"
    color="secondary"
    :size="size"
  >
    {{ startCase(fundingRegion.region) }}
  </v-chip>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { isNil, startCase } from "lodash"
import { type VChip } from "vuetify/components"

import useFundingRegion from "@/use/use-funding-region"

const props = withDefaults(
  defineProps<{
    fundingRegionId: number | null | undefined
    size?: VChip["size"]
  }>(),
  {
    size: "small",
  }
)

const { fundingRegionId } = toRefs(props)
const { fundingRegion } = useFundingRegion(fundingRegionId)
</script>
