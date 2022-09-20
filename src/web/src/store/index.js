import Vue from "vue";
import Vuex from "vuex";
import { secureGet } from "./jwt";
import { USER_URL } from "@/urls";

import auth from "./auth";

import home from "@/modules/home/store";
import administration from "@/modules/administration/store";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {},
  state: {
    user: {},
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    async initialize() {
      console.log("Initializing Store");
      await this.dispatch("home/initialize");

      console.log("Initializing Complete");
    },
    async getCurrentUser(state) {
      let userResp = await secureGet(`${USER_URL}/me`);
      state.commit("SET_USER", userResp.data.data);
      return userResp.data.data;
    },
  },
  modules: {
    home,
    auth,
    administration,
  },
});
