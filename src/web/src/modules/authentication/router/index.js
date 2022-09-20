
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "SignIn",
        path: "sign-in",
        component: () => import("../views/SignIn"),
      },
      {
        name: "Inactive",
        path: "inactive",
        component: () => import("../views/Inactive"),
      },
    ],
  },
];

export default routes;
