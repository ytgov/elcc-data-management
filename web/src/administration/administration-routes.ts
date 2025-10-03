const routes = [
  {
    path: "/",
    component: async () => await import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "administration",
        component: async () => await import("@/modules/administration/views/Administration.vue"),
      },
      {
        path: "administration/users",
        component: async () => await import("@/modules/users/views/UserList.vue"),
      },
      {
        path: "administration/funding-periods",
        component: async () => await import("@/modules/administration/views/FundingPeriodList.vue"),
      },
      {
        path: "administration/submission-lines",
        component: async () =>
          await import("@/modules/submission-lines/views/SubmissionLinesList.vue"),
      },
    ],
  },
]

export default routes
