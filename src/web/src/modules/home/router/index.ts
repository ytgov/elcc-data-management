import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("../views/Dashboard.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/profile",
        component: () => import("../views/Profile.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
