import { PROFILE_URL } from "../urls";
import { secureGet } from "./jwt";

const state = {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    username: "",
    roles: "",
};
const getters = {
    firstName: state => state.firstName,
    lastName: state => state.lastName,
    email: state => state.email,
    id: state => state.id,
    username: state => state.username,
    roles: state => state.roles,
};
const actions = {
    async loadProfile({ commit }) {
        console.log (`Loading Profile from ${PROFILE_URL}`)
        await secureGet(PROFILE_URL)
            .then(resp => {
                commit("setProfile", resp.data.data);
            });
    },
};
const mutations = {
    setProfile(state, profile) {
        state.firstName = profile.first_name;
        state.lastName = profile.last_name;
        state.email = profile.email;
        state.status = profile.status;
        state.roles = profile.roles;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};