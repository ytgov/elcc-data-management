import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/router";
import adminstrationRoutes from "@/modules/administration/router";
import authenticationRoutes from "@/modules/authentication/router";
import centreRoutes from "@/modules/centre/router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    children: [
      {
        path: "",
        component: () => import("@/views/Default.vue"),
      },
      ...authenticationRoutes,
      ...homeRoutes,
      ...adminstrationRoutes,
      ...centreRoutes,

      {
        path: "*",
        component: () => import("@/views/NotFound.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
