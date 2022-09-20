import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "./store";
import "./plugins/base";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import VueCurrencyInput from 'vue-currency-input'

import Notifications from "./components/Notifications";

Vue.config.productionTip = false;

axios.defaults.withCredentials = true;

Vue.component("notifications", Notifications);

Vue.use(VueCurrencyInput, { globalOptions: { currency: 'USD', locale: 'en' } });

import { Auth0Plugin } from '@/auth/auth0-plugin';
// import { domain, clientId, audience } from '../auth_config.json';


Vue.use(Auth0Plugin, {
  // domain,
  // client_id: clientId,
  // audience,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
