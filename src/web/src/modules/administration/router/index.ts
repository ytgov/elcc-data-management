import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "/administration",
        component: () => import("../views/Administration.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/users",
        component: () => import("../views/UserList.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
