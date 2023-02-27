import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./routes";

// Plugins
import { registerPlugins } from "./plugins";

import { domain, client_id, audience } from "../auth-config.json";

import { Auth0Plugin } from "./auth";

const pinia = createPinia();

const app = createApp(App);
// app.use(Auth0Plugin, {
//   domain,
//   client_id,
//   audience,
//   onRedirectCallback: (appState: any) => {
//     router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
//   }
// });
app.use(pinia);
app.use(router);
registerPlugins(app);

app.mount("#app");
