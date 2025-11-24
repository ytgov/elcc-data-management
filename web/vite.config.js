/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url"

// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: {
        labs: true,
      },
    }),
  ],
  build: {
    outDir: "./dist",
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@/tests": fileURLToPath(new URL("./tests", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 8080,
  },
  test: {
    globals: true, // https://vitest.dev/config/#globals
  },
})
