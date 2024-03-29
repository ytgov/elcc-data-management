import { defineStore, getActivePinia } from "pinia"

import { useNotificationStore } from "@/store/NotificationStore"
import { useApiStore } from "@/store/ApiStore"
import { PROFILE_URL } from "@/urls"

const m = useNotificationStore()

async function waitSomeSeconds(seconds: number) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve("T")
    }, seconds * 1000)
  })
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: "",
      roles: [""],
      ynetId: "",
    },
  }),
  getters: {
    userRoles(state) {
      return state.user.roles
    },
    isAdmin(state) {
      return true
      // return state.user.roles.includes("System Administrator");
    },
  },
  actions: {
    async initialize() {
      console.log("Initializing user store...")

      await this.loadCurrentUser()

      // await waitSomeSeconds(3);
      // go and get user details

      // await this.getRoles();

      console.log("Initialized user store")
    },
    toggleAdmin() {
      if (this.isAdmin) {
        this.user.roles = this.user.roles.filter((role) => role !== "System Administrator")
        this.user.roles.push("User")
      } else {
        this.user.roles = this.user.roles.filter((role) => role !== "User")
        this.user.roles.push("System Administrator")
      }

      const message = {
        status_code: 200,
        text: "Changed role to " + this.user.roles,
        icon: "mdi-information",
        variant: "success",
      }
      m.notify(message)
    },
    async loadCurrentUser() {
      const api = useApiStore()
      await api.secureCall("get", PROFILE_URL).then((resp) => {
        this.user = resp.data || {}
        this.user.roles = []
      })
    },
    async getRoles() {
      console.log("getting roles")

      const api = useApiStore()
      api.secureCall("get", PROFILE_URL)
    },
  },
})
