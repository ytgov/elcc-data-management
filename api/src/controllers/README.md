# Controllers

These files map api routes to services.
See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions

e.g.

```typescript
router.route("/api/forms").post(FormsController.create)
```

maps the `/api/forms` POST endpoint to the `FormsController#create` instance method.

Controllers are advantageous because they provide a suite of helper methods to access various request methods. .e.g. `currentUser`, or `params`. They also provide a location to perform policy checks.

Controllers should implement the BaseController, and provide instance methods.
The `BaseController` provides the magic that lets those methods map to an appropriate route.

## Namespacing

If you need an action that generates estimates for a given form, a POST route `/api/forms/:formId/estimates/generate` is the best way to avoid future conflicts and refactors. To implement this you need to "namespace/modularize" the controller. Generally speaking, it is more flexible to keep all routes as CRUD actions, and nest controllers as needed, than it is to add custom routes to a given controller.

e.g. `Forms.Estimates.GenerateController.create` is preferred to `FormsController#generateEstimates` because once you start using non-CRUD actions, your controllers will quickly expand beyond human readability and comprehension. Opting to use PascalCase for namespaces as that is the best way to avoid conflicts with local variables.

This is how you would create a namespaced controller:

```bash
api/
|-- src/
|   |-- controllers/
|       |-- forms/
|           |-- estimates/
|               |-- generate-controller.ts
|       |-- index.ts
```

```typescript
// api/src/controllers/forms/estimates/generate-controller.ts
import BaseController from "@/base-controller"

export class GenerateController extends BaseController {
  static create() {
    // Logic for generating estimates here...
  }
}
```

```typescript
// api/src/controllers/forms/estimates/index.ts
export * from "./generate-controller"

export default undefined
```

```typescript
// api/src/controllers/forms/index.ts
import * as Estimates from "./estimates"

export { Estimates }
```

```typescript
// api/src/controllers/index.ts
import * as Forms from "./forms"

export { Forms }
```

```typescript
// api/src/routes/index.ts
import { Router } from "express"

import { Forms } from "@/controllers"

const router = Router()

router.post("/api/forms/:formId/estimates/generate", Forms.Estimates.GenerateController.create)
```
