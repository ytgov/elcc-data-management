import { authGuard } from "@auth0/auth0-vue"
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import adminstrationRoutes from "@/administration/administration-routes"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: async () => await import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        redirect: {
          name: "Dashboard",
        },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: async () => await import("@/modules/home/views/Dashboard.vue"),
      },
      {
        path: "profile",
        component: async () => await import("@/modules/home/views/Profile.vue"),
      },

      {
        path: "child-care-centres",
        component: () => import("@/modules/centre/views/CentreList.vue"),
      },
      {
        // TODO: replace centerId with a slug using https://github.com/simov/slugify on center name
        // also add the appropriate slug column to the centre table and model
        path: "child-care-centres/:centreId/:fiscalYearSlug?",
        component: () => import("@/modules/centre/pages/CentreDashboardPage.vue"),
        props: true,
        children: [
          {
            path: "",
            name: "CentreDashboardPage",
            redirect: {
              name: "CentreDashboardSummaryPage",
            },
          },
          {
            path: "summary",
            component: () => import("@/modules/centre/pages/CentreDashboardSummaryPage.vue"),
            props: (route) => ({
              centreId: parseInt(route.params.centreId as string),
              fiscalYearSlug: route.params.fiscalYearSlug,
            }),
            children: [
              {
                path: "",
                name: "CentreDashboardSummaryPage",
                redirect: {
                  name: "CentreDashboardSummaryReconciliationPage",
                },
              },
              {
                path: "reconciliation",
                name: "CentreDashboardSummaryReconciliationPage",
                component: () =>
                  import("@/modules/centre/pages/CentreDashboardSummaryReconciliationPage.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  fiscalYearSlug: route.params.fiscalYearSlug,
                }),
              },
              {
                path: "payments",
                name: "CentreDashboardSummaryPaymentsPage",
                component: () =>
                  import("@/modules/centre/pages/CentreDashboardSummaryPaymentsPage.vue"),
                props: (route) => ({
                  centreId: parseInt(route.params.centreId as string),
                  fiscalYearSlug: route.params.fiscalYearSlug,
                }),
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
    component: async () => await import("@/modules/authentication/views/SignIn.vue"),
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
    component: async () => await import("@/views/NotFound.vue"),
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
