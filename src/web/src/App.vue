<script setup lang="ts">
import Notifications from "@/components/Notifications.vue";

import { useApiStore } from "@/store/ApiStore";

components: {
  Notifications;
}

const api = useApiStore();
</script>

<template>
  <v-app>
    <router-view />
    <notifications />
  </v-app>
</template>
