
const routes = [
  {
    path: "",
    component: () => import("@/layouts/Blank.vue"),
    children: [
      {
        path: "/sign-in",
        component: () => import("../views/SignIn.vue"),
      },
    ],
  },
];

export default routes;
