<script setup lang="ts">
import Notifications from "@/components/Notifications.vue"

import { useApiStore } from "@/store/ApiStore"

useApiStore()
</script>

<template>
  <v-app>
    <router-view />
    <notifications />
  </v-app>
</template>
