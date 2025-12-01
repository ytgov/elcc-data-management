/**
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import "@/assets/yk-style.css"

// ComposablesF
import { createVuetify } from "vuetify"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#0097a9",
          secondary: "#24405A", // yg_zinc - darker color so outline buttons are visible
          accent: "#F2A900", // yg_sun
          error: "#9b1b27",
          info: "#0097a9",
          success: "#7A9A01", // yg_moss
          warning: "#DC4405", // yg_lichen
          anchor: "#00818f",
          background: "#eeeeee",
          surface: "#ffffff",
          // Yukon Government brand colors
          "yg-moss": "#7A9A01",
          "yg-blue": "#0097a9",
          "yg-blue-light": "#0097a966",
          "yg-zinc": "#24405A",
          "yg-twilight": "#512A44",
          "yg-lichen": "#DC4405",
          "yg-sun": "#F2A900",
        },
      },
      dark: {
        colors: {
          primary: "#0097a9",
          secondary: "#24405A",
          accent: "#F2A900",
          success: "#7A9A01",
          warning: "#DC4405",
          "yg-moss": "#7A9A01",
          "yg-blue": "#0097a9",
          "yg-zinc": "#24405A",
          "yg-twilight": "#512A44",
          "yg-lichen": "#DC4405",
          "yg-sun": "#F2A900",
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: true,
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VBtn: {
      rounded: "md",
    },
    VCard: {
      elevation: 3,
    },
    VCombobox: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VDateInput: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      prependIcon: "",
      appendInnerIcon: "mdi-calendar",
      inputFormat: "yyyy-mm-dd",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
  },
})
