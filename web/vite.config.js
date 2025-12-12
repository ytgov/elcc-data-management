/// <reference types="vitest/config" />
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
    environment: "jsdom",
    globals: true, // https://vitest.dev/config/#globals
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    setupFiles: ["./tests/setup.ts"],
    // Mocking
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    // Mock CSS imports
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
})
