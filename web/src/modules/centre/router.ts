import { authGuard } from "@auth0/auth0-vue"
import { RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/child-care-centres",
    component: () => import("@/layouts/Default.vue"),
    children: [
      {
        path: "",
        component: () => import("./views/CentreList.vue"),
        beforeEnter: authGuard,
      },
      {
        path: ":centreId",
        component: () => import("@/modules/centre/pages/CentreDashboardPage.vue"),
        beforeEnter: authGuard,
        props: (route) => ({ centreId: route.params.centreId }),
        children: [
          {
            path: "",
            name: "CentreDashboardPage",
            redirect: { name: "CentreDashboardSummaryPage" },
          },
          {
            path: "summary",
            component: () => import("@/modules/centre/pages/CentreDashboardSummaryPage.vue"),
            props: true,
            children: [
              {
                path: "",
                name: "CentreDashboardSummaryPage",
                redirect: { name: "CentreDashboard-SummaryTab-ReconciliationTab" },
              },
              {
                path: "reconciliation",
                name: "CentreDashboard-SummaryTab-ReconciliationTab",
                component: () => import("./components/PaymentSummary.vue"),
                props: true,
              },
              {
                path: "worksheets",
                name: "CentreDashboard-SummaryTab-WorksheetsTab",
                component: () => import("./components/WorksheetSummary.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                }),
              },
              {
                path: "payments",
                name: "CentreDashboard-SummaryTab-PaymentsTab",
                component: () => import("./components/PaymentsTable.vue"),
                props: true,
              },
            ],
          },
          {
            path: "worksheets",
            name: "CentreDashboard-WorksheetsTab",
            component: () => import("./components/CentreDashboardWorksheetsTab.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
            }),
            children: [
              {
                path: ":month",
                name: "CentreDashboard-WorksheetsTab-MonthlyWorksheetTab",
                component: () =>
                  import("./components/CentreDashboardWorksheetsTabMonthlyWorksheetTab.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  month: route.params.month,
                }),
              },
            ],
          },
          {
            path: "employees",
            name: "EmployeesPage",
            component: () => import("./pages/EmployeesPage.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
            }),
          },
        ],
      },
    ],
  },
]

export default routes
