/// <reference types="vitest" />
// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from "vite"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  build: {
    outDir: "./dist",
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
      "@models": `${path.resolve(__dirname, "../api/src/data/models")}`,
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
