import { createApp } from "vue"
import { createPinia } from "pinia"

import { AuthHelper as authPlugin } from "@/plugins/auth"
import vuetifyPlugin from "@/plugins/vuetify"

import { router } from "@/routes"

import App from "@/App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(router).use(authPlugin).use(vuetifyPlugin)

app.mount("#app")
