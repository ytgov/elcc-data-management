import { authGuard } from "@auth0/auth0-vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { pick } from "lodash"

import adminstrationRoutes from "@/routes/administration-routes"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        redirect: {
          name: "DashboardPage",
        },
      },
      {
        path: "dashboard",
        name: "DashboardPage",
        component: () => import("@/pages/DashboardPage.vue"),
      },
      {
        path: "profile",
        name: "ProfilePage",
        component: () => import("@/pages/ProfilePage.vue"),
      },

      {
        path: "child-care-centres",
        name: "ChildCareCentresPage",
        component: () => import("@/pages/ChildCareCentresPage.vue"),
      },
      {
        // TODO: replace centerId with a slug using https://github.com/simov/slugify on center name
        // also add the appropriate slug column to the centre table and model
        path: "child-care-centres/:centreId/:fiscalYearSlug?",
        component: () => import("@/layouts/child-care-centers/ChildCareCenterLayout.vue"),
        props: (route) => pick(route.params, ["centreId", "fiscalYearSlug"]),
        children: [
          {
            path: "",
            name: "child-care-centers/ChildCareCenterRedirect",
            redirect: {
              name: "child-care-centers/ChildCareCenterSummaryRedirect",
            },
          },
          {
            path: "summary",
            component: () =>
              import("@/layouts/child-care-centers/ChildCareCenterSummaryLayout.vue"),
            props: true,
            children: [
              {
                path: "",
                name: "child-care-centers/ChildCareCenterSummaryRedirect",
                redirect: {
                  name: "child-care-centers/summary/SummaryReconciliationPage",
                },
              },
              {
                path: "reconciliation",
                name: "child-care-centers/summary/SummaryReconciliationPage",
                component: () =>
                  import("@/pages/child-care-centers/summary/SummaryReconciliationPage.vue"),
                props: true,
              },
              {
                path: "payments",
                name: "child-care-centers/summary/SummaryPaymentsPage",
                component: () =>
                  import("@/pages/child-care-centers/summary/SummaryPaymentsPage.vue"),
                props: true,
              },
            ],
          },
          {
            path: "worksheets",
            name: "CentreDashboardWorksheetsPage",
            component: () => import("@/modules/centre/pages/CentreDashboardWorksheetsPage.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
              fiscalYearSlug: route.params.fiscalYearSlug,
              month: route.params.month,
            }),
            children: [
              {
                path: ":month",
                name: "child-care-centres/worksheets/MonthlyWorksheetPage",
                component: () =>
                  import("@/pages/child-care-centres/worksheets/MonthlyWorksheetPage.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  fiscalYearSlug: route.params.fiscalYearSlug,
                  month: route.params.month,
                }),
              },
            ],
          },
          {
            path: "employees",
            name: "CentreDashboardEmployeesPage",
            component: () => import("@/modules/centre/pages/CentreDashboardEmployeesPage.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
              fiscalYearSlug: route.params.fiscalYearSlug,
            }),
            children: [
              {
                path: ":month",
                name: "CentreDashboardEmployeesMonthlyWorksheetPage",
                component: () =>
                  import("@/modules/centre/pages/CentreDashboardEmployeesMonthlyWorksheetPage.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  fiscalYearSlug: route.params.fiscalYearSlug,
                  month: route.params.month,
                }),
              },
            ],
          },
        ],
      },
    ],
  },
  ...adminstrationRoutes,
  {
    path: "/sign-in",
    name: "SignInPage",
    component: () => import("@/pages/SignInPage.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: "StatusPage",
    path: "/status",
    component: () => import("@/pages/StatusPage.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      requiresAuth: false,
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth === false) return true

  const isAuthenticated = await authGuard(to)
  if (!isAuthenticated) return false

  return true
})

export default router
