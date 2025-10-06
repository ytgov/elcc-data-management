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
        name: "administration/UsersPage",
        component: () => import("@/pages/administration/AdminstrationUsersPage.vue"),
      },
      {
        path: "administration/funding-periods",
        component: () => import("@/modules/administration/views/FundingPeriodList.vue"),
      },
      {
        path: "administration/submission-lines",
        name: "administration/AdministrationSubmissionLinesPage",
        component: () => import("@/pages/administration/AdministrationSubmissionLinesPage.vue"),
      },
    ],
  },
]

export default routes
