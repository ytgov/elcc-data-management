import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import homeRoutes from "@/modules/home/router"
import adminstrationRoutes from "@/modules/administration/router"
import authenticationRoutes from "@/modules/authentication/router"
import centreRoutes from "@/modules/centre/routes"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    children: [
      {
        path: "",
        component: async () => await import("@/views/Default.vue"),
      },
      ...authenticationRoutes,
      ...homeRoutes,
      ...adminstrationRoutes,
      ...centreRoutes,
      {
        name: "StatusPage",
        path: "/status",
        component: () => import("@/pages/StatusPage.vue"),
      },
      {
        path: "*",
        component: async () => await import("@/views/NotFound.vue"),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
