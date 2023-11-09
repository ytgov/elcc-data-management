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
        props: true,
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
        ],
      },
    ],
  },
]

export default routes
