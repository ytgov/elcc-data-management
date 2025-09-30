import { createApp } from "vue"
import { createPinia } from "pinia"

import auth0Plugin from "@/plugins/auth0-plugin"
import vuetifyPlugin from "@/plugins/vuetify-plugin"

import { router } from "@/routes"

import App from "@/App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(router).use(auth0Plugin).use(vuetifyPlugin)

app.mount("#app")
