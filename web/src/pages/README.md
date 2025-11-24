# Pages

Any component that is directly routeable is considered a page.
Pages are to be placed in the `pages` directory with a patch matching their URL.
The name of the page component should end in `Page`.

Any component with a `<router-view>` can be considered a layout component.
Layout components are to be placed in the `layouts` directory.
The name of the layout component should end in `Layout`.

If you want to redirect to the first child of a layout use an empty route and match the layout name, replacing `Layout` with `Redirect`.

The current naming conventions for pages is pretty random, but over time it will hopefully become more consistent and similar to this example.

## Constraints

1. It should take minimal effort to figure out where to add a new page component, and what to call if for a given user-centric URL.
2. It should be easy to add page variations. e.g. edit vs. non-edit
3. Route names must be unique.
4. It should be easy to find a component given the vue-router route name.
5. It should be easy to find the page component for a given URL.

## Directory Structure

For example

```bash
src/
├── layouts/
│   ├── child-care-centers/
│   │   ├── ChildCareCenterLayout.vue
│   │   ├── ChildCareCenterSummaryLayout.vue
├── pages/
│   ├── child-care-centres/
│   │   ├── summary/
│   │   │   ├── SummaryReconciliationPage.vue
│   │   ├── worksheets/
│   │   │   ├── MonthlyWorksheetsPage.vue
│   │   │   ├── MonthlyWorksheetPage.vue
```

## Routes

For example

```ts
const routes = [
  {
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
        component: () => import("@/layouts/child-care-centers/ChildCareCenterSummaryLayout.vue"),
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
        ],
      },
      {
        path: "worksheets",
        name: "child-care-centres/worksheets/MonthlyWorksheetsPage",
        component: () => import("@/pages/child-care-centres/worksheets/MonthlyWorksheetsPage.vue"),
        children: [
          {
            path: ":month",
            name: "child-care-centres/worksheets/MonthlyWorksheetPage",
            component: () =>
              import("@/pages/child-care-centres/worksheets/MonthlyWorksheetPage.vue"),
            props: true,
          },
        ],
      },
    ],
  },
]
```
