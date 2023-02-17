import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    message: {
      status_code: 0,
      text: "Empty Message",
      icon: "mdi-information",
      variant: "primary",
    },
    showNotification: false,
  }),
  actions: {
    async initialize() {},
    notify(message: any) {
      this.message = message;
      this.showNotification = true;
    },
  },
});
