<template>
  <v-autocomplete
    v-model="selectedRoles"
    :items="availableRoles"
    label="Roles"
    auto-select-first
    chips
    multiple
  />
</template>

<script setup lang="ts">
import { UserRoles } from "@/api/users-api"

const selectedRoles = defineModel<UserRoles[]>("roles")

const availableRoles = [
  {
    title: "User",
    value: UserRoles.USER,
  },
  {
    title: "System Admin",
    value: UserRoles.SYSTEM_ADMINISTRATOR,
  },
]
</script>
