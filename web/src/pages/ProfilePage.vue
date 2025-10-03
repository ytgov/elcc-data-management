<template>
  <div>
    <h1>My Profile</h1>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="currentUser.firstName"
          label="First name"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="currentUser.lastName"
          label="Last name"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="currentUser.email"
          label="Email"
          readonly
          hide-details
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="roles"
          label="Roles"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"
          hide-details
        >
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import useCurrentUser from "@/use/use-current-user"

const { currentUser } = useCurrentUser<true>()

const roles = computed(() => currentUser.value.roles.map(({ role }) => role).join(", "))
</script>
