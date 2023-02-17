/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/assets/yk-style.css";

// ComposablesF
import { createVuetify } from "vuetify";
import * as labs from "vuetify/labs/components";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...labs,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#0097a9",
          secondary: "#fff",
          anchor: "#00818f",
          yg_moss: "#7A9A01",
          yg_blue: "#0097a9",
          yg_zinc: "#24405A",
          yg_twilight: "#512A44",
          yg_lichen: "#DC4405",
          yg_sun: "#F2A900",
        },
      },
      dark: {
        colors: {
          yg_moss: "#7A9A01",
          yg_blue: "#0097a9",
          yg_zinc: "#24405A",
          yg_twilight: "#512A44",
          yg_lichen: "#DC4405",
          yg_sun: "#F2A900",
        },
      },
    },
  },
});
