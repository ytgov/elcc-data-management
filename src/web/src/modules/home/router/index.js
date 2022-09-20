
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        meta: { requiresAuth: true },
        component: () => import("../views/Dashboard.vue"),
      },
      {
        name: "Profile",
        path: "profile",
        meta: { requiresAuth: true },
        component: () => import("../views/Profile"),
      },
      {
        name: "Search",
        path: "search",
        meta: { requiresAuth: true },
        component: () => import("../views/Search"),
      },
    ]
  }
];

export default routes;
