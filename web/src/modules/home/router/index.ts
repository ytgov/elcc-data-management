import { authGuard } from "@auth0/auth0-vue"

const routes = [
  {
    path: "",
    component: async () => await import("@/layouts/Default.vue"),
    children: [
      {
        name: "Dashboard",
        path: "/dashboard",
        component: async () => await import("../views/Dashboard.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/profile",
        component: async () => await import("../views/Profile.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
]

export default routes
