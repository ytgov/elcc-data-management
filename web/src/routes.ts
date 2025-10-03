import { authGuard } from "@auth0/auth0-vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import adminstrationRoutes from "@/modules/administration/router"
import centreRoutes from "@/modules/centre/routes"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: async () => await import("@/layouts/Default.vue"),
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        component: async () => await import("@/modules/home/views/Dashboard.vue"),
      },
      {
        path: "profile",
        component: async () => await import("@/modules/home/views/Profile.vue"),
      },
      ...adminstrationRoutes,
      ...centreRoutes,
    ],
  },
  {
    path: "/sign-in",
    name: "SignInPage",
    component: async () => await import("@/modules/authentication/views/SignIn.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: "StatusPage",
    path: "/status",
    component: () => import("@/pages/StatusPage.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: async () => await import("@/views/NotFound.vue"),
    meta: {
      requiresAuth: false,
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth === false) return true

  const isAuthenticated = await authGuard(to)
  if (!isAuthenticated) return false

  return true
})

export default router
