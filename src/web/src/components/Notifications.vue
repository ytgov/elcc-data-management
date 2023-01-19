<template>
  <v-snackbar
    v-model="showNotification"
    location="bottom right"
    :color="prettyMessage(message).color"
  >
    <v-icon class="mr-3">{{ prettyMessage(message).icon }}</v-icon>
    {{ message.text }}
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
      console.log(mutation.type, mutation.payload);
      console.log(state.showNotification);
    });
  },

  name: "Notifications",
  data: () => ({}),
  computed: {
    ...mapWritableState(useNotificationStore, ["showNotification", "message"]),
  },
  methods: {
    prettyMessage(message :any) {
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
    // show(color, icon, message) {
    //   this.color = color;
    //   this.icon = icon;
    //   this.text = message;
    //   this.visible = true;
    // },
    // showSuccess(message) {
    //   this.color = "green";
    //   this.icon = "mdi-thumb-up";
    //   this.text = message;
    //   this.visible = true;
    // },
    // showError(message) {
    //   this.color = "red";
    //   this.icon = "mdi-thumb-down";
    //   this.text = message;
    //   this.visible = true;
    // },
    // showAPIMessages(apiResponse) {
    //   if (apiResponse.errors) {
    //     return this.showError(apiResponse.errors[0].text);
    //   }
    //   if (apiResponse.messages) {
    //     let message = apiResponse.messages[0];
    //     if (message.variant == "success") this.showSuccess(message.text);
    //     else if (message.variant == "error") this.showError(message.text);
    //     else this.show(message.variant, "mdi-help-circle", message.text);
    //     return;
    //   }
    //   this.show("primary", "mdi-check", "Complete");
    // },
  },
};
</script>
