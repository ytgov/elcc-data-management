
const routes = [
  {
    path: "",
    component: async () => await import("@/layouts/Blank.vue"),
    children: [
      {
        path: "/sign-in",
        component: async () => await import("../views/SignIn.vue"),
      },
    ],
  },
];

export default routes;
