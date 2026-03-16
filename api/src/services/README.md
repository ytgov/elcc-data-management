# Services

Services hold business logic for create and update workflows. Controllers should coordinate requests, but services should own multi-step mutations.

## Responsibilities

- Validate and normalize complex input before persistence
- Encapsulate create and update workflows
- Keep database mutations and business rules out of controllers
- Return the created or updated model so controllers can serialize the result

## Guidelines

- Prefer `CreateService` and `UpdateService` classes when the pattern matches existing code
- Pass the minimum data needed rather than whole request objects
- Keep authorization in policies and response formatting in serializers
- Reuse model scopes and helpers instead of duplicating query logic in services
- When a small piece of service logic repeats, do not over-generalize it into a shared helper unless the ownership and reuse boundary are clear
