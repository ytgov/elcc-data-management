<template>
  <v-chip
    :color="roleConfig.color"
  >
    {{ roleConfig.label }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { UserRoles } from "@/api/users-api"

const props = defineProps<{
  role: UserRoles
}>()

const roleConfig = computed(() => {
  switch (props.role) {
    case UserRoles.USER:
      return {
        label: "User",
        color: "yg-twilight",
      }

    case UserRoles.SYSTEM_ADMINISTRATOR:
      return {
        label: "System Administrator",
        color: "yg-moss",
      }

    default:
      return {
        label: props.role,
        color: "primary",
      }
  }
})
</script>
