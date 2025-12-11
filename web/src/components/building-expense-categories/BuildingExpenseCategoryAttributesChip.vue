<template>
  <v-chip
    variant="tonal"
    color="secondary"
    :size="size"
  >
    {{ buildingExpenseCategory.categoryName }}
  </v-chip>
</template>

<script setup lang="ts">
import { type VChip } from "vuetify/components"

import { BuildingExpenseCategory } from "@/api/building-expense-categories-api"

withDefaults(
  defineProps<{
    buildingExpenseCategory: BuildingExpenseCategory
    size?: VChip["size"]
  }>(),
  {
    size: "small",
  }
)
</script>
