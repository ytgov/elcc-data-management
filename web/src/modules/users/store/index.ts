import { defineStore } from "pinia"

import { useNotificationStore } from "@/store/NotificationStore"
import { useApiStore } from "@/store/ApiStore"
import { PROFILE_URL, USERS_URL } from "@/urls"

const m = useNotificationStore()

interface AdminState {
  users: AppUser[]
  selectedUser: AppUser | undefined
  isLoading: boolean
}

export const useUserAdminStore = defineStore("userAdmin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
  }),
  getters: {
    userCount(state) {
      if (state && state.users) return state.users.length
      return 0
    },
  },
  actions: {
    async getAllUsers() {
      this.isLoading = true
      const api = useApiStore()
      await api
        .secureCall("get", USERS_URL)
        .then((resp) => {
          this.users = resp.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    async getRoles() {
      console.log("getting roles")

      const api = useApiStore()
      api.secureCall("get", PROFILE_URL)
    },
    selectUser(user: any) {
      this.selectedUser = user
    },
    unselectUser() {
      this.selectedUser = undefined
    },
    async saveUser() {
      this.isLoading = true
      const api = useApiStore()

      if (this.selectedUser != null) {
        await api
          .secureCall("put", `${USERS_URL}/${this.selectedUser.email}`, this.selectedUser)
          .then((resp) => {
            this.users = resp.data
            this.unselectUser()
          })
          .finally(() => {
            this.isLoading = false
          })

        m.notify({ text: "User saved", variant: "success" })
        this.getAllUsers()
      }
    },
  },
})

export interface AppUser {
  email: string
  firstName: string
  lastName: string
  displayName: string
  isAdmin: boolean
  status: string
}
