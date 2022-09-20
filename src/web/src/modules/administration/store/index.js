import { HEALTHCHECK_URL, USER_URL } from "@/urls";
import { getInstance } from "@/auth/auth0-plugin"

const state = {
  //appHealth is an array of componentHealth
  appHealth: [],
  componentHealth: {
    "name": "",
    "status": false,
    "loading": true,
    "helpNotes": "" //what to do if something this component is broken
  },
  users: []
};

const actions = {
  async doHealthCheck({ commit }) {
    console.log("Checking app health")
    let response = await fetch(HEALTHCHECK_URL)
    let data = await response.json()
    commit("SET_APP_HEALTH", data)
  },
  async seedData() {
    let response = await fetch("http://localhost:3000/seed")
    let data = await response.text()
    return data
  },
  async loadUsers({ commit }) {
    const auth = getInstance();

    return auth.get(USER_URL)
      .then(resp => {
        let data = resp.data.data;
        commit("SET_USERS", data)
        console.log(`Loaded ${data.length} users`)
        return data
      })
      .catch(err => {
        console.log("BROKEN", err)
      })
  },
  async saveUser({dispatch}, item) {
    const auth = getInstance();
    let body = { roles: item.roles, status: item.status, department_admin_for: item.department_admin_for};
    const result = await auth.put(`${USER_URL}/${item.email}`, body);
    if (result.status === 200) {
      dispatch("loadUsers");
    }
    return result
  },
  async createUser({dispatch}, item) {
    const auth = getInstance();

    let body = item;
    let result = await auth.post(`${USER_URL}`, body);
    dispatch("loadUsers")
    return result;
  }
};

const mutations = {
  SET_APP_HEALTH(state, payload) {
    state.appHealth = payload.appHealth;
  },
  SET_USERS(state, value) {
    state.users = value;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};