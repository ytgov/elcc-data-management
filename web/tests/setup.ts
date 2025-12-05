import ResizeObserver from "resize-observer-polyfill"

import { mockHttpClient } from "@/tests/support/mock-http-client"
import { mockCurrentUserApi } from "@/tests/support/mock-current-user-api"

// Polyfill for ResizeObserver (required by Vuetify components)
// See: https://vuetifyjs.com/en/getting-started/unit-testing/#using-vite
global.ResizeObserver = ResizeObserver

beforeEach(() => {
  mockHttpClient()
  mockCurrentUserApi()
})
