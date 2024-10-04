# Pages

Any component that is directly routeable is considered a page.
Pages are to be placed in the `pages` directory with a patch matching their URL.
The name of the page component should end in `Page`.

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
├── pages/
│   ├── child-care-centres/
│   │   ├── CentreDashboardPage.vue
│   │   ├── worksheets/
│   │   │   ├── MonthlyWorksheetsPage.vue
│   │   │   ├── MonthlyWorksheetPage.vue
```

## Routes

For example

```ts
const routes = [
  {
    path: "/child-care-centres/:centreSlug/:fiscalYearSlug?",
    name: "child-care-centres/CentreDashboardPage",
    component: () => import("@/pages/child-care-centres/CentreDashboardPage.vue"),
    props: true,
    children: [
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
