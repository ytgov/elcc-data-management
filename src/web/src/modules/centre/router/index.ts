import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "/child-care-centres",
    component: async () => await import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        component: async () => await import("../views/CentreList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: ":id",
        component: async () => await import("../views/CentreDashboard.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
