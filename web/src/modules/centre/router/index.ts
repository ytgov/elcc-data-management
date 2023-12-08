import { authGuard } from "@auth0/auth0-vue"
import { RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/child-care-centres",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/CentreList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: ":centreId",
        name: "CentreDashboard",
        component: () => import("../views/CentreDashboard.vue"),
        beforeEnter: authGuard,
        props: (route) => ({ centreId: route.params.centreId }),
        children: [
          {
            path: "summary",
            component: () => import("../components/CentreDashboardSummaryTab.vue"),
            props: true,
            children: [
              {
                path: "",
                name: "CentreDashboard-SummaryTab",
                redirect: { name: "CentreDashboard-SummaryTab-ReconciliationTab" },
              },
              {
                path: "reconciliation",
                name: "CentreDashboard-SummaryTab-ReconciliationTab",
                component: () => import("../components/PaymentSummary.vue"),
                props: true,
              },
              {
                path: "worksheets",
                name: "CentreDashboard-SummaryTab-WorksheetsTab",
                component: () => import("../components/WorksheetSummary.vue"),
              },
              {
                path: "payments",
                name: "CentreDashboard-SummaryTab-PaymentsTab",
                component: () => import("../components/PaymentsTable.vue"),
                props: true,
              },
            ],
          },
          {
            path: "worksheets",
            name: "CentreDashboard-WorksheetsTab",
            component: () => import("../components/CentreDashboardWorksheetsTab.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
            }),
            children: [
              // {
              //   path: "",
              //   name: "CentreDashboard-WorksheetsTab",
              //   redirect: (to) => ({
              //     name: "CentreDashboard-WorksheetsTab-MonthlyWorksheetTab",
              //     params: {
              //       centreId: parseInt(to.params.centreId as string),
              //       fundingSubmissionLineJsonId: parseInt(
              //         to.params.fundingSubmissionLineJsonId as string
              //       ),
              //       month: "april",
              //     },
              //   }),
              // },
              {
                path: ":month",
                name: "CentreDashboard-WorksheetsTab-MonthlyWorksheetTab",
                component: () =>
                  import("../components/CentreDashboardWorksheetsTabMonthlyWorksheetTab.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  month: route.params.month,
                }),
              },
            ],
          },
        ],
      },
    ],
  },
]

export default routes
