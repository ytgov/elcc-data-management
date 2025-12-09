const routes = [
  {
    path: "/",
    component: () => import("@/layouts/AdministrationLayout.vue"),
    children: [
      {
        path: "administration",
        name: "AdministrationPage",
        component: () => import("@/pages/AdministrationPage.vue"),
      },
      {
        path: "administration/users",
        name: "administration/UsersPage",
        component: () => import("@/pages/administration/AdministrationUsersPage.vue"),
      },
      {
        path: "administration/users/new",
        name: "administration/users/UserNewPage",
        component: () => import("@/pages/administration/users/UserNewPage.vue"),
      },
      {
        path: "administration/users/:userId",
        name: "administration/users/UserPage",
        component: () => import("@/pages/administration/users/UserPage.vue"),
        props: true,
      },
      {
        path: "administration/users/:userId/edit",
        name: "administration/users/UserEditPage",
        component: () => import("@/pages/administration/users/UserEditPage.vue"),
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
        component: () => import("@/pages/administration/funding-periods/FundingPeriodNewPage.vue"),
      },
      {
        path: "administration/funding-periods/:fundingPeriodId",
        name: "administration/funding-periods/FundingPeriodPage",
        component: () => import("@/pages/administration/funding-periods/FundingPeriodPage.vue"),
        props: true,
      },
      {
        path: "administration/funding-periods/:fundingPeriodId/edit",
        name: "administration/funding-periods/FundingPeriodEditPage",
        component: () => import("@/pages/administration/funding-periods/FundingPeriodEditPage.vue"),
        props: true,
      },
      {
        path: "administration/funding-regions",
        name: "administration/FundingRegionsPage",
        component: () => import("@/pages/administration/AdministrationFundingRegionsPage.vue"),
      },
      {
        path: "administration/funding-regions/new",
        name: "administration/funding-regions/FundingRegionNewPage",
        component: () => import("@/pages/administration/funding-regions/FundingRegionNewPage.vue"),
      },
      {
        path: "administration/funding-regions/:fundingRegionId",
        name: "administration/funding-regions/FundingRegionPage",
        component: () => import("@/pages/administration/funding-regions/FundingRegionPage.vue"),
        props: true,
      },
      {
        path: "administration/funding-regions/:fundingRegionId/edit",
        name: "administration/funding-regions/FundingRegionEditPage",
        component: () => import("@/pages/administration/funding-regions/FundingRegionEditPage.vue"),
        props: true,
      },
      {
        path: "administration/submission-lines",
        name: "administration/AdministrationSubmissionLinesPage",
        component: () => import("@/pages/administration/AdministrationSubmissionLinesPage.vue"),
      },
      {
        path: "administration/submission-lines/new",
        name: "administration/submission-lines/SubmissionLineNewPage",
        component: () =>
          import("@/pages/administration/submission-lines/SubmissionLineNewPage.vue"),
      },
      {
        path: "administration/submission-lines/:fundingSubmissionLineId",
        name: "administration/submission-lines/SubmissionLinePage",
        component: () => import("@/pages/administration/submission-lines/SubmissionLinePage.vue"),
        props: true,
      },
      {
        path: "administration/submission-lines/:fundingSubmissionLineId/edit",
        name: "administration/submission-lines/SubmissionLineEditPage",
        component: () =>
          import("@/pages/administration/submission-lines/SubmissionLineEditPage.vue"),
        props: true,
      },
    ],
  },
]

export default routes
