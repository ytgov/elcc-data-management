# Composables

This directory holds shared Vue composables. Follow the singular/plural split for data-access composables.

## Singular Composables

Use `use-model.ts` for one record identified by an id.

- Accept `Ref<number | null | undefined>`
- Fetch with `modelApi.get(id)`
- Return a single record, policy, loading state, and error state
- Provide `save()` for updates when applicable
- Re-fetch automatically when the id changes

## Plural Composables

Use `use-models.ts` for list and query operations.

- Accept `Ref<QueryOptions>`
- Fetch with `modelApi.list(queryOptions)`
- Return an array, `totalCount`, loading state, and error state
- Support reactive filters, pagination, and optional fetch-skipping logic
- Re-fetch automatically when query options change

## Naming

- Use singular names for single-record composables: `useUser`
- Use plural names for collection composables: `useEmployeeBenefits`
- Keep exported types near the composable when they come from the matching API module
