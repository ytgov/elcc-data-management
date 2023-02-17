import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./routes";

// Plugins
import { registerPlugins } from "./plugins";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
registerPlugins(app);

app.mount("#app");
