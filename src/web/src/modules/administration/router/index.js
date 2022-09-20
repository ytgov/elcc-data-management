
const routes = [
  {
    path: "/administration",
    component: () => import("@/layouts/Layout"),
    meta: { requiresAuth: true },
    children: [
      {
        name: "AdministrationHome",
        path: "",
        meta: { requiresAuth: true },
        component: () => import("../views/Home.vue"),
      },
      {
        path: 'users',
        name: "AdminUsers",
        component: () =>
          import("../views/Users"),
        meta: { requiresAuth: true },
      }
    ]
  },
]

export default routes;
