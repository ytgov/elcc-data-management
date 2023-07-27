import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "",
    component: async () => await import("@/layouts/Default.vue"),
    children: [
      {
        path: "/administration",
        component: async () => await import("../views/Administration.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/users",
        component: async () => await import("@/modules/users/views/UserList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/funding-periods",
        component: async () => await import("../views/FundingPeriodList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/submission-lines",
        component: async () => await import("@/modules/submission-lines/views/SubmissionLinesList.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
