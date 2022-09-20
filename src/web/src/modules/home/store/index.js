import { PROFILE_URL, EMPLOYEE_URL } from "@/urls";
import { secureGet, securePost } from "@/store/jwt";

const state = {
    profile: {},
};

const actions = {
    async initialize(store) {
        console.log("-- Initializing Home Store")
        await store.dispatch("loadProfile")
    },
    async loadProfile({ commit }) {
        await secureGet(PROFILE_URL)
            .then(resp => {
                commit("setProfile", resp.data.data);
            });
    },
    async employeeSearch(store, terms) {
        return await securePost(`${EMPLOYEE_URL}/search`, { terms })
    }
};

const mutations = {
    setProfile(state, value) {
        state.profile = value;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};