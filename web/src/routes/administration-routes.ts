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
        path: "administration/users/:userId",
        name: "administration/users/UserPage",
        component: () => import("@/pages/administration/users/UserPage.vue"),
        props: true,
      },
      {
        path: "administration/funding-periods",
        name: "administration/FundingPeriodsPage",
        component: () => import("@/pages/administration/AdministrationFundingPeriodsPage.vue"),
      },
      {
        path: "administration/funding-periods/new",
        name: "administration/funding-periods/FundingPeriodNewPage",
        component: () =>
          import("@/pages/administration/funding-periods/FundingPeriodNewPage.vue"),
      },
      {
        path: "administration/funding-periods/:fundingPeriodId",
        name: "administration/funding-periods/FundingPeriodPage",
        component: () => import("@/pages/administration/funding-periods/FundingPeriodPage.vue"),
        props: true
      },
      {
        path: "administration/submission-lines",
        name: "administration/AdministrationSubmissionLinesPage",
        component: () => import("@/pages/administration/AdministrationSubmissionLinesPage.vue"),
      },
      {
        path: "administration/submission-lines/:fundingSubmissionLineId",
        name: "administration/submission-lines/SubmissionLinePage",
        component: () =>
          import("@/pages/administration/submission-lines/SubmissionLinePage.vue"),
        props: true,
      },
    ],
  },
]

export default routes
