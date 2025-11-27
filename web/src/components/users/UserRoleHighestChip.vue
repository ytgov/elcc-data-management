<template>
  <UserRoleChip :role="highestRole" />
</template>

<script setup lang="ts">
import { computed } from "vue"

import { UserRoles } from "@/api/users-api"

import UserRoleChip from "@/components/users/UserRoleChip.vue"

const props = defineProps<{
  roles: UserRoles[]
}>()

const highestRole = computed(() => {
  const rolePriority = [
    UserRoles.SYSTEM_ADMINISTRATOR,
    UserRoles.SUPER_ADMIN,
    UserRoles.ADMIN,
    UserRoles.EDITOR,
    UserRoles.USER,
  ]

  for (const role of rolePriority) {
    if (props.roles.includes(role)) {
      return role
    }
  }

  return UserRoles.USER
})
</script>
