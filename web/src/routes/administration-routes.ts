const routes = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "administration",
        name: "AdministrationPage",
        component: () => import("@/pages/AdministrationPage.vue"),
      },
      {
        path: "administration/users",
        component: () => import("@/modules/users/views/UserList.vue"),
      },
      {
        path: "administration/funding-periods",
        component: () => import("@/modules/administration/views/FundingPeriodList.vue"),
      },
      {
        path: "administration/submission-lines",
        component: () => import("@/modules/submission-lines/views/SubmissionLinesList.vue"),
      },
    ],
  },
]

export default routes
