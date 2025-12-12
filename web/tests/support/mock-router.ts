import { createRouter, createMemoryHistory, type RouteRecordRaw } from "vue-router"

/**
 * Usage:
 * At the top section of a test file import:
 *   import { mockRouter } from "@/tests/support"
 *
 * Then in your test setup:
 *   const router = mockRouter()
 *
 * Then use it in your component mount:
 *   mount(Component, {
 *     global: {
 *       plugins: [router],
 *     },
 *   })
 *
 * Note that order of operations matters. This file must be imported before any file that imports router.
 * As such this file has been imported and mocked in the pre-test run "web/tests/setup.ts" file.
 *
 * @param routes - Optional custom routes to use. If not provided, uses minimal default routes.
 * @returns A configured Vue Router instance for testing
 */
export function mockRouter(routes: RouteRecordRaw[] = []) {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

export default mockRouter
