import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "/child-care-centres",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/CentreList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: ":id",
        component: () => import("../views/CentreDashboard.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
