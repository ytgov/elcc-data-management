import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL, USERS_URL } from "@/urls";

let m = useNotificationStore();

interface AdminState {
  users: Array<AppUser>;
  selectedUser: AppUser | undefined;
  isLoading: Boolean;
}

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
  }),
  getters: {
    userCount(state) {
      return state.users.length;
    },
  },
  actions: {
    async getAllUsers() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", USERS_URL)
        .then((resp) => {
          this.users = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getRoles() {
      console.log("getting roles");

      let api = useApiStore();
      api.secureCall("get", PROFILE_URL);
    },
    selectUser(user: any) {
      this.selectedUser = user;
    },
    unselectUser() {
      this.selectedUser = undefined;
    },
    async save() {
      //save selectedUser to API

      m.notify("User saved");
      this.getAllUsers();
    }
  },
});

export interface AppUser {
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
}
