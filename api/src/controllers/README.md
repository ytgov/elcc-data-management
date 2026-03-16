# Controllers

Controllers coordinate the request lifecycle:

```text
Route -> Controller -> Policy -> Service -> Model -> Serializer -> Response
```

Use controllers to read request state, apply authorization, call services, and render serialized responses. Keep persistence and multi-step business logic in services.

## Guidelines

- Extend `BaseController` and implement instance methods
- Build `where`, scopes, ordering, and pagination in the controller when listing resources
- Apply policy scope and authorization checks in the controller layer
- Use serializers to shape responses
- Keep error handling consistent and log failures with enough context to debug them

## Namespacing

Prefer namespaced CRUD-style controllers over custom action methods on large resource controllers.

- Prefer `Forms.Estimates.GenerateController.create`
- Avoid `FormsController.generateEstimates`

This keeps routes composable and prevents controllers from growing into mixed collections of unrelated custom actions.
