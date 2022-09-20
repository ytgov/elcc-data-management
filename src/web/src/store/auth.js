import { secureGet } from "./jwt";
import { AUTH_CHECK_URL } from "../urls";


const state = {
    // user: null,
    // fullName: "",
    // roles: [],
    // authService: null,
    token: null,
};
const getters = {


};
const actions = {
    async checkAuthentication({ commit }) {
        await secureGet(AUTH_CHECK_URL)
            .then(resp => {
                commit("setUser", resp.data.data);
            }).catch(() => {
                commit("clearUser");
            });
    },
    async signOut({ commit }) {
        commit("profile/clearUser");
    }
};
const mutations = {
    setToken(state, paylod) {
        state.token=paylod;
    },
    setUser(state, user) {
        state.user = user;
        state.fullName = user.display_name;
        state.roles = user.roles;
    },
    clearUser(state) {
        state.user = null;
        state.fullName = null;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};