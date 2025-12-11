import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

/**
 * Creates a Vuetify instance configured for testing.
 *
 * This follows Vuetify's official testing recommendations:
 * - Creates a real Vuetify instance (don't mock transitions or internals)
 * - Includes all components and directives
 * - Should be passed through the `plugins` option in mount()
 *
 * See: https://vuetifyjs.com/en/getting-started/unit-testing/
 *
 * Usage:
 * At the top section of a test file import:
 *   import { mockVuetify } from "@/tests/support"
 *
 * Then in your test setup:
 *   const vuetify = mockVuetify()
 *
 * Then use it in your component mount:
 *   mount(Component, {
 *     global: {
 *       plugins: [vuetify],
 *     },
 *   })
 *
 * Note that order of operations matters. This file must be imported before any file that imports Vuetify.
 * As such this file has been imported and mocked in the pre-test run "web/tests/setup.ts" file.
 *
 * @returns A configured Vuetify instance for testing
 */
export function mockVuetify() {
  return createVuetify({
    components,
    directives,
  })
}

export default mockVuetify
