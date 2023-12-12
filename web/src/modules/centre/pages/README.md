# web/src/modules/centre/pages/README.md

1. Pages are components that can be routed to directly.
2. Component names should end in `Page`.
3. Page components should be in the ./pages/ directory.
4. Components that relate to a specific page be in the ./components/name-of-page-component/ directory.

> Note pages might be tabs rendered inside other components, but as long as they are directly routable, they should be considered a page. I would call them "Routables", but pages are a much more well known concept.

e.g.

- `web/src/modules/centres/pages/EmployeesPage.vue`
  has page specific components at `web/src/modules/centres/components/employees-page/SomeComponent.vue`
