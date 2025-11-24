import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: ".",
      projects: ["./tsconfig.json", "./tests/tsconfig.json"],
    }),
  ],
  test: {
    globals: true,
    root: ".",
    globalSetup: "./tests/global-setup.ts",
    setupFiles: ["./tests/setup.ts"],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Mocking
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
