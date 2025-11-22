<template>
  <v-chip
    v-for="roleConfig in roleConfigs"
    :key="roleConfig.value"
    class="ma-1"
    :color="roleConfig.color"
  >
    {{ roleConfig.label }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { UserRoles } from "@/api/users-api"

const props = defineProps<{
  roles: UserRoles[]
}>()

const roleConfigs = computed(() => {
  return props.roles.map((role) => {
    switch (role) {
      case UserRoles.USER:
        return {
          value: role,
          label: "User",
          color: "yg-twilight",
        }

      case UserRoles.SYSTEM_ADMINISTRATOR:
        return {
          value: role,
          label: "System Administrator",
          color: "yg-moss",
        }

      default:
        return {
          value: role,
          label: role,
          color: "primary",
        }
    }
  })
})
</script>
