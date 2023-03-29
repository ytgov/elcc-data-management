<template>
  <v-snackbar v-model="showNotification" location="bottom right" :color="prettyMessage(message).color">
    <v-icon class="mr-3" color="white">{{ prettyMessage(message).icon }}</v-icon>
    <span style="color: white">{{ message.text }}</span>
  </v-snackbar>
</template>

<script lang="ts">
import { useNotificationStore } from "../store/NotificationStore";
import { mapWritableState } from "pinia";

export default {
  setup() {
    const notifcation = useNotificationStore();

    // this subscription will be kept even after the component is unmounted
    notifcation.$subscribe((mutation, state) => {
      //console.log(mutation.type, mutation.events);
      //console.log(state.showNotification);
    });
  },

  name: "Notifications",
  data: () => ({}),
  computed: {
    ...mapWritableState(useNotificationStore, ["showNotification", "message"]),
  },
  methods: {
    prettyMessage(message: any) {
      if (message.variant == "success") {
        return {
          color: "green",
          icon: "mdi-check",
          text: message.text,
        };
      } else if (message.variant == "error") {
        return {
          color: "red",
          icon: "mdi-cancel",
          text: message.text,
        };
      } else {
        return {
          color: message.variant,
          icon: "mdi-information",
          text: message.text,
        };
      }
    },
  },
};
</script>
