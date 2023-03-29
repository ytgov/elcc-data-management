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
        component: () => import("@/modules/users/views/UserList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/funding-periods",
        component: () => import("../views/FundingPeriodList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/administration/submission-lines",
        component: () => import("@/modules/submission-lines/views/SubmissionLinesList.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
];

export default routes;
