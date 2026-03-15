# Components

Use this directory for reusable UI building blocks. Keep feature-specific details in the feature folder, but document cross-cutting component patterns here.

## Responsibilities

- Prefer dedicated pages over dialogs for complex workflows.
- Parent components should discover records. Child components should edit or display a specific record.
- When lookups are complex, the parent absorbs that complexity and passes stable identifiers or already-resolved state to the child.
- Handle loading, empty, error, and success states explicitly.

## Naming and Location

- Directory names are plural and kebab-case: `components/employee-benefits/`
- Component names are PascalCase and use singular or plural based on the entity count:
  - `EmployeeBenefitCard.vue`
  - `EmployeeBenefitsDataTable.vue`
- Use an optional modifier only when it adds meaning:
  - `Edit`, `Manage`, `Create`, `Server`
- Suffix the name with the outermost Vuetify component:
  - `Dialog`, `DataTable`, `Table`, `Card`, `Form`

Pattern:

```text
components/{model-plural}/{ModelSingularOrPlural}[Modifier]{VuetifyComponent}.vue
```

## Event Handlers

- Name functions for the action performed, not the DOM event.
- Prefer `startEditingRow`, `saveAndExitEditMode`, and `handleKeyboardNavigation` over `onClick`, `onBlur`, or `onKeyDown`.
- Call action functions directly from the template when the event wrapper adds no value.
