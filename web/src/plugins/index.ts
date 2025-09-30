/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import vuetify from "./vuetify"
import { type App } from "vue"

export function registerPlugins(app: App<Element>) {
  app.use(vuetify)
}
