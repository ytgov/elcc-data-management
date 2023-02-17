import axios from "axios";
import { PROFILE_URL } from "../urls";

const state = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  username: "",
  teams: [],
};
const getters = {
  firstName: (state: any) => state.firstName,
  lastName: (state: any) => state.lastName,
  email: (state: any) => state.email,
  id: (state: any) => state.id,
  username: (state: any) => state.username,
  teams: (state: any) => state.teams,
};
const actions = {
  async loadProfile(store: any) {
    await axios
      .get(PROFILE_URL)
      .then((resp) => {
        store.commit("setProfile", resp.data.data);
      })
      .catch(() => {
        store.commit("clearUser");
      });
  },
};
const mutations = {
  setProfile(state: any, profile: any) {
    state.firstName = profile.first_name;
    state.lastName = profile.last_name;
    state.email = profile.email;
    state.id = profile.id;
    state.username = profile.display_name;
    state.teams = profile.teams;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
