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

export const useUserAdminStore = defineStore("userAdmin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
  }),
  getters: {
    userCount(state) {
      if (state && state.users) return state.users.length;
      return 0;
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
    async saveUser() {
      this.isLoading = true;
      let api = useApiStore();

      if (this.selectedUser) {
        await api
          .secureCall("put", `${USERS_URL}/${this.selectedUser.email}`, this.selectedUser)
          .then((resp) => {
            this.users = resp.data;
            this.unselectUser();
          })
          .finally(() => {
            this.isLoading = false;
          });

        m.notify({ text: "User saved", variant: "success" });
        this.getAllUsers();
      }
    },
  },
});

export interface AppUser {
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_admin: boolean;
  status: string;
}
