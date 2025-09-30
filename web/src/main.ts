import { createApp } from "vue"
import { createPinia } from "pinia"
import { router } from "./routes"
import { AuthHelper } from "@/plugins/auth"

// Plugins
import { registerPlugins } from "./plugins"
import { type Auth0Plugin } from "@auth0/auth0-vue"

import App from "./App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(router).use(AuthHelper)

app.config.globalProperties.$auth = AuthHelper

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $auth: Auth0Plugin
  }
}

export {} // Important! See note.

registerPlugins(app)

app.mount("#app")
