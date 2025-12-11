---
description: Complete workflow for adding full CRUD admin UI pages for any model in the ELCC Data Management system. Includes backend (Model, Controller, Policy, Services, Serializers, Routes) and frontend (API Client, Composables, Components, Pages, Integration) requirements with implementation checklist.
auto_execution_mode: 1
---

# Create Admin UI Workflow

> **Purpose:** Add complete CRUD admin interface for any model in the ELCC Data Management system.
>
> **Scope:** Backend API + Frontend UI + Testing
>
> **Reference Implementation:** FundingRegion (commit: `973af90`)

## Prerequisites Checklist

Before starting, ensure:

- [ ] Backend model exists with proper validation
- [ ] Database migration is complete
- [ ] You understand the model's relationships and business logic
- [ ] You have admin access to test the implementation

---

## Backend Implementation

### 1. Model (`api/src/models/[resource-name].ts`)

**Required Structure:**

```typescript
import {
  DataTypes,
  Op,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

export class ResourceName extends BaseModel<
  InferAttributes<ResourceName>,
  InferCreationAttributes<ResourceName>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare fieldName: string

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE)
  declare deletedAt: Date | null

  // CRITICAL: Required for search and uniqueness validation
  static establishScopes() {
    this.addSearchScope(["fieldName"])

    this.addScope("excludingIds", (resourceIds: string[]) => {
      return {
        where: {
          id: {
            [Op.notIn]: resourceIds,
          },
        },
      }
    })
  }
}
```

**Checklist:**
- [ ] Extends `BaseModel`
- [ ] Includes soft delete (`deletedAt`)
- [ ] **CRITICAL:** Implements `establishScopes()` with search and excludingIds
- [ ] Uses proper decorators
- [ ] Uses `sql.fn("getutcdate")` for timestamps

### 2. Controller (`api/src/controllers/[resource-names]-controller.ts`)

**Template:**

```typescript
import { isNil } from "lodash"
import logger from "@/utils/logger"
import { ResourceName } from "@/models"
import { ResourceNamePolicy } from "@/policies/resource-name-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/resource-names"
import { IndexSerializer, ShowSerializer } from "@/serializers/resource-names"
import BaseController from "@/controllers/base-controller"

export class ResourceNamesController extends BaseController<ResourceName> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["fieldName", "ASC"]])
      const scopedResources = ResourceNamePolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedResources.count({ where })
      const resources = await scopedResources.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedResources = IndexSerializer.perform(resources)
      return this.response.json({ resourceNames: serializedResources, totalCount })
    } catch (error) {
      logger.error(`Error fetching resources: ${error}`, { error })
      return this.response.status(400).json({ message: `Error fetching resources: ${error}` })
    }
  }

  async show() {
    try {
      const resource = await this.loadResourceName()
      if (isNil(resource)) {
        return this.response.status(404).json({ message: "Resource not found" })
      }

      const policy = this.buildPolicy(resource)
      if (!policy.show()) {
        return this.response.status(403).json({ message: "Not authorized" })
      }

      const serialized = ShowSerializer.perform(resource)
      return this.response.json({ resourceName: serialized, policy })
    } catch (error) {
      logger.error(`Error fetching resource: ${error}`, { error })
      return this.response.status(400).json({ message: `Error fetching resource: ${error}` })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({ message: "Not authorized" })
      }

      const permitted = policy.permitAttributesForCreate(this.request.body)
      const resource = await CreateService.perform(permitted, this.currentUser)
      const serialized = ShowSerializer.perform(resource)
      return this.response.status(201).json({ resourceName: serialized, policy })
    } catch (error) {
      logger.error(`Error creating resource: ${error}`, { error })
      return this.response.status(422).json({ message: `Error creating resource: ${error}` })
    }
  }

  async update() {
    try {
      const resource = await this.loadResourceName()
      if (isNil(resource)) {
        return this.response.status(404).json({ message: "Resource not found" })
      }

      const policy = this.buildPolicy(resource)
      if (!policy.update()) {
        return this.response.status(403).json({ message: "Not authorized" })
      }

      const permitted = policy.permitAttributes(this.request.body)
      const updated = await UpdateService.perform(resource, permitted, this.currentUser)
      const serialized = ShowSerializer.perform(updated)
      return this.response.json({ resourceName: serialized, policy })
    } catch (error) {
      logger.error(`Error updating resource: ${error}`, { error })
      return this.response.status(422).json({ message: `Error updating resource: ${error}` })
    }
  }

  async destroy() {
    try {
      const resource = await this.loadResourceName()
      if (isNil(resource)) {
        return this.response.status(404).json({ message: "Resource not found" })
      }

      const policy = this.buildPolicy(resource)
      if (!policy.destroy()) {
        return this.response.status(403).json({ message: "Not authorized" })
      }

      await DestroyService.perform(resource, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting resource: ${error}`, { error })
      return this.response.status(422).json({ message: `Error deleting resource: ${error}` })
    }
  }

  private loadResourceName() {
    return ResourceName.findByPk(this.params.resourceNameId)
  }

  private buildPolicy(resource: ResourceName = ResourceName.build()) {
    return new ResourceNamePolicy(this.currentUser, resource)
  }
}
```

**Checklist:**
- [ ] All 5 CRUD methods (index, show, create, update, destroy)
- [ ] Proper HTTP status codes (200, 201, 204, 400, 403, 404, 422)
- [ ] Policy authorization checks
- [ ] Error logging
- [ ] Uses services for mutations
- [ ] Uses serializers

### 3. Policy (`api/src/policies/[resource-name]-policy.ts`)

```typescript
import { Attributes, FindOptions } from "@sequelize/core"
import { type Path } from "@/utils/deep-pick"
import { ResourceName, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class ResourceNamePolicy extends PolicyFactory(ResourceName) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true
    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true
    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true
    return false
  }

  permittedAttributes(): Path[] {
    return ["field1", "field2"]
  }

  permittedAttributesForCreate(): Path[] {
    return this.permittedAttributes()
  }

  static policyScope(_user: User): FindOptions<Attributes<ResourceName>> {
    return ALL_RECORDS_SCOPE
  }
}
```

**Checklist:**
- [ ] Authorization methods (show, create, update, destroy)
- [ ] Permitted attributes whitelist
- [ ] Policy scope for index filtering

### 4. Services (`api/src/services/[resource-names]/`)

**create-service.ts:**
```typescript
export class CreateService {
  static async perform(
    attributes: Partial<ResourceName>,
    currentUser: User
  ): Promise<ResourceName> {
    return await ResourceName.create(attributes)
  }
}
```

**update-service.ts:**
```typescript
export class UpdateService {
  static async perform(
    resource: ResourceName,
    attributes: Partial<ResourceName>,
    currentUser: User
  ): Promise<ResourceName> {
    return await resource.update(attributes)
  }
}
```

**destroy-service.ts:**
```typescript
export class DestroyService {
  static async perform(resource: ResourceName, currentUser: User): Promise<void> {
    await resource.destroy()
  }
}
```

**index.ts:**
```typescript
export { CreateService } from "./create-service"
export { UpdateService } from "./update-service"
export { DestroyService } from "./destroy-service"
```

**Checklist:**
- [ ] Create, Update, Destroy services
- [ ] Export from index.ts

### 5. Serializers (`api/src/serializers/[resource-names]/`)

**index-serializer.ts:**
```typescript
export class IndexSerializer {
  static perform(resources: ResourceName[]) {
    return resources.map((resource) => ({
      id: resource.id,
      fieldName: resource.fieldName,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }))
  }
}
```

**show-serializer.ts:**
```typescript
export class ShowSerializer {
  static perform(resource: ResourceName) {
    return {
      id: resource.id,
      fieldName: resource.fieldName,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }
  }
}
```

**index.ts:**
```typescript
export { IndexSerializer } from "./index-serializer"
export { ShowSerializer } from "./show-serializer"
```

**Checklist:**
- [ ] Index and Show serializers
- [ ] Export from index.ts

### 6. Routes (`api/src/router.ts`)

```typescript
// Add import at top
import { ResourceNamesController } from "@/controllers"

// Add routes in REST section
router
  .route("/api/resource-names")
  .get(ResourceNamesController.index)
  .post(ResourceNamesController.create)
router
  .route("/api/resource-names/:resourceNameId")
  .get(ResourceNamesController.show)
  .patch(ResourceNamesController.update)
  .delete(ResourceNamesController.destroy)
```

**Checklist:**
- [ ] Import controller
- [ ] Add REST routes
- [ ] Routes behind auth middleware

**Backend Complete:** ✅

---

## Frontend Implementation

### 1. API Client (`web/src/api/[resource-names]-api.ts`)

```typescript
import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type ResourceName = {
  id: number
  fieldName: string
  createdAt: string
  updatedAt: string
}

export type ResourceNamePolicy = Policy
export type ResourceNameAsShow = ResourceName
export type ResourceNameAsIndex = ResourceName

export type ResourceNameWhereOptions = WhereOptions<ResourceName, "id" | "fieldName">

export type ResourceNameFiltersOptions = FiltersOptions<{
  search: string
  excludingIds?: number[]
}>

export type ResourceNameQueryOptions = QueryOptions<
  ResourceNameWhereOptions,
  ResourceNameFiltersOptions
>

export const resourceNamesApi = {
  async list(params: ResourceNameQueryOptions = {}): Promise<{
    resourceNames: ResourceNameAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/resource-names", { params })
    return data
  },

  async get(id: number): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.get(`/api/resource-names/${id}`)
    return data
  },

  async create(attributes: Partial<ResourceName>): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.post("/api/resource-names", attributes)
    return data
  },

  async update(id: number, attributes: Partial<ResourceName>): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.patch(`/api/resource-names/${id}`, attributes)
    return data
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/api/resource-names/${id}`)
  },
}

export default resourceNamesApi
```

**Checklist:**
- [ ] Type definitions
- [ ] All CRUD methods
- [ ] Proper TypeScript types

### 2. Composables

**List (`web/src/use/use-resource-names.ts`):**

```typescript
import { type Ref, reactive, ref, toRefs, unref, watch } from "vue"
import {
  resourceNamesApi,
  type ResourceNameQueryOptions,
  type ResourceNameAsIndex,
} from "@/api/resource-names-api"

export type { ResourceNameFiltersOptions } from "@/api/resource-names-api"

export function useResourceNames(
  queryOptions: Ref<ResourceNameQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive({
    resourceNames: [] as ResourceNameAsIndex[],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { resourceNames, totalCount } = await resourceNamesApi.list(unref(queryOptions))
      state.resourceNames = resourceNames
      state.totalCount = totalCount
      return resourceNames
    } catch (error) {
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return
      await fetch()
    },
    { deep: true, immediate: true }
  )

  return { ...toRefs(state), fetch, refresh: fetch }
}

export default useResourceNames
```

**Single (`web/src/use/use-resource-name.ts`):**

```typescript
import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"
import {
  resourceNamesApi,
  type ResourceNameAsShow,
  type ResourceNamePolicy,
} from "@/api/resource-names-api"

export function useResourceName(resourceId: Ref<number | null | undefined>) {
  const state = reactive({
    resourceName: null as ResourceNameAsShow | null,
    policy: null as ResourceNamePolicy | null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    const id = unref(resourceId)
    if (isNil(id)) return

    state.isLoading = true
    try {
      const { resourceName, policy } = await resourceNamesApi.get(id)
      state.resourceName = resourceName
      state.policy = policy
      return resourceName
    } catch (error) {
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save() {
    if (isNil(state.resourceName)) return

    const updated = await resourceNamesApi.update(
      state.resourceName.id,
      state.resourceName
    )
    state.resourceName = updated.resourceName
    state.policy = updated.policy
    return updated.resourceName
  }

  watch(() => unref(resourceId), fetch, { immediate: true })

  return { ...toRefs(state), fetch, refresh: fetch, save }
}

export default useResourceName
```

**Checklist:**
- [ ] List composable
- [ ] Single composable with save method
- [ ] Proper reactive state

### 3. Unique Text Field Component (if field is unique)

**`web/src/components/[resource-names]/[ResourceName][Field]UniqueTextField.vue`:**

```vue
<template>
  <UniqueTextField
    v-model="fieldValue"
    label="Field Label"
    :check-availability="checkFieldAvailability"
    unique-validation-message="Field must be unique"
    is-unique-message="Field is available"
    is-not-unique-message="Field is already taken"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isEmpty } from "lodash"

import resourceNamesApi from "@/api/resource-names-api"
import UniqueTextField from "@/components/common/UniqueTextField.vue"

const fieldValue = defineModel<string | null | undefined>({
  required: true,
})

const props = withDefaults(
  defineProps<{
    excludingIds?: number[]
  }>(),
  {
    excludingIds: () => [],
  }
)

const filters = computed(() => {
  if (isEmpty(props.excludingIds)) return {}
  return { excludingIds: props.excludingIds }
})

async function checkFieldAvailability(name: string) {
  const { resourceNames } = await resourceNamesApi.list({
    where: { fieldName: name },
    filters: filters.value,
  })
  return resourceNames.length === 0
}
</script>
```

**Usage:**
- NewPage: `<ResourceNameFieldUniqueTextField v-model="attributes.field" />`
- EditPage: `<ResourceNameFieldUniqueTextField v-model="resource.field" :excluding-ids="[resourceId]" />`

**Checklist:**
- [ ] Create for unique fields
- [ ] Uses excludingIds with filters

### 4. Edit Form Component

**`web/src/components/[resource-names]/[ResourceName]EditForm.vue`:**

```vue
<template>
  <v-skeleton-loader v-if="isNil(resourceName)" type="card" />
  <v-form v-else ref="form" @submit.prevent="validateSaveAndNotify">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="resourceName.fieldName"
          label="Field Name *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn color="primary" :loading="isSaving" type="submit">
          Save Changes
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="outlined"
          :to="{
            name: 'administration/resource-names/ResourceNamePage',
            params: { resourceNameId },
          }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRefs, useTemplateRef } from "vue"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import useResourceName from "@/use/use-resource-name"
import useSnack from "@/use/use-snack"

const props = defineProps<{
  resourceNameId: number
}>()

const emit = defineEmits<{
  saved: [resourceNameId: number]
}>()

const { resourceNameId } = toRefs(props)
const { resourceName, save } = useResourceName(resourceNameId)

const isSaving = ref(false)
const snack = useSnack()
const form = useTemplateRef("form")

async function validateSaveAndNotify() {
  if (isNil(resourceName.value)) return
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  isSaving.value = true
  try {
    await save()
    emit("saved", props.resourceNameId)
    snack.success("Resource saved!")
  } catch (error) {
    console.error(`Failed to update resource: ${error}`, { error })
    snack.error(`Failed to update resource: ${error}`)
  } finally {
    isSaving.value = false
  }
}
</script>
```

**Checklist:**
- [ ] Form validation
- [ ] Skeleton loader
- [ ] Uses v-else
- [ ] CurrencyInput for money fields
- [ ] Unique fields with :excluding-ids

### 5. Pages

#### List Page (`web/src/pages/administration/Administration[ResourceNames]Page.vue`)

```vue
<template>
  <HeaderActionsCard>
    <template #header>
      <v-text-field
        :model-value="search"
        label="Search"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        @update:model-value="debounceUpdateSearch"
      />
    </template>
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{ name: 'administration/resource-names/ResourceNameNewPage' }"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        New Resource
      </v-btn>
    </template>

    <ResourceNamesDataTableServer :filters="filters" />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { debounce } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { type ResourceNameFiltersOptions } from "@/use/use-resource-names"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import ResourceNamesDataTableServer from "@/components/resource-names/ResourceNamesDataTableServer.vue"

const search = ref("")

function updateSearch(value: string) {
  search.value = value
}

const debounceUpdateSearch = debounce(updateSearch, 500)

const filters = computed(() => {
  const filters: ResourceNameFiltersOptions = {}
  if (search.value) {
    filters.search = search.value
  }
  return filters
})

useBreadcrumbs("Resource Names", [
  {
    title: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    title: "Resource Names",
    to: { name: "administration/ResourceNamesPage" },
  },
])
</script>
```

#### New Page (`web/src/pages/administration/[resource-names]/[ResourceName]NewPage.vue`)

```vue
<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    title="New Resource"
    @submit.prevent="createResource"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="resourceAttributes.fieldName"
          label="Field Name *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn :loading="isLoading" color="primary" variant="flat" type="submit">
        Create Resource
      </v-btn>
      <v-spacer />
      <v-btn
        color="warning"
        variant="outlined"
        :loading="isLoading"
        :to="{ name: 'administration/ResourceNamesPage' }"
      >
        Cancel
      </v-btn>
    </template>
  </HeaderActionsFormCard>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import { required } from "@/utils/validators"

import resourceNamesApi, { type ResourceName } from "@/api/resource-names-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"

import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"

const resourceAttributes = ref<Partial<ResourceName>>({
  fieldName: "",
})

const headerActionsFormCard = ref<InstanceType<typeof HeaderActionsFormCard> | null>(null)
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

async function createResource() {
  if (isNil(headerActionsFormCard.value)) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    const { resourceName } = await resourceNamesApi.create(resourceAttributes.value)
    snack.success("Resource created successfully!")
    return router.push({
      name: "administration/resource-names/ResourceNamePage",
      params: { resourceNameId: resourceName.id },
    })
  } catch (error) {
    console.error(`Failed to create resource: ${error}`, { error })
    snack.error(`Failed to create resource: ${error}`)
  } finally {
    isLoading.value = false
  }
}

useBreadcrumbs("Resource Creation", [
  {
    title: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    title: "Resource Names",
    to: { name: "administration/ResourceNamesPage" },
  },
  {
    title: "New Resource",
    to: { name: "administration/resource-names/ResourceNameNewPage" },
  },
])
</script>
```

**Checklist:**
- [ ] List page with debounced search
- [ ] New page with embedded form
- [ ] Show page with details
- [ ] Edit page using EditForm component

### 6. Integration

**Routes (`web/src/routes/administration-routes.ts`):**

```typescript
{
  path: "/administration/resource-names",
  name: "administration/ResourceNamesPage",
  component: () => import("@/pages/administration/AdministrationResourceNamesPage.vue"),
},
{
  path: "/administration/resource-names/new",
  name: "administration/resource-names/ResourceNameNewPage",
  component: () => import("@/pages/administration/resource-names/ResourceNameNewPage.vue"),
},
{
  path: "/administration/resource-names/:resourceNameId",
  name: "administration/resource-names/ResourceNamePage",
  component: () => import("@/pages/administration/resource-names/ResourceNamePage.vue"),
  props: true,
},
{
  path: "/administration/resource-names/:resourceNameId/edit",
  name: "administration/resource-names/ResourceNameEditPage",
  component: () => import("@/pages/administration/resource-names/ResourceNameEditPage.vue"),
  props: true,
},
```

**Navigation (`web/src/components/administration-layout/AdministrationSidebarNavigationDrawer.vue`):**

```vue
<v-list-item
  prepend-icon="mdi-icon-name"
  title="Resource Names"
  :to="{ name: 'administration/ResourceNamesPage' }"
/>
```

**Metrics (`web/src/components/administration-layout/QuickMetricsCard.vue`):**

```typescript
// 1. Import
import useResourceNames from "@/use/use-resource-names"

// 2. Add to items
{
  title: "Resource Names",
  count: totalCountResourceNames.value,
  actions: {
    to: { name: "administration/ResourceNamesPage" },
  },
}

// 3. Add composable
const resourceNamesQuery = computed(() => ({ perPage: 1 }))
const { totalCount: totalCountResourceNames, isLoading: isLoadingResourceNames } =
  useResourceNames(resourceNamesQuery)

// 4. Add to isLoading
const isLoading = computed(() => {
  return (
    // ... other loading states ||
    isLoadingResourceNames.value
  )
})
```

**Checklist:**
- [ ] Routes added
- [ ] Navigation link added
- [ ] QuickMetricsCard updated

**Frontend Complete:** ✅

---

## Key Patterns (CRITICAL)

### Backend
1. ✅ **Always implement `establishScopes()`** with search and excludingIds

### Frontend
2. ✅ **Never create separate CreateForm components** - embed in NewPage
3. ✅ **Always create separate EditForm components** - complex logic
4. ✅ **Debounce search inputs** - 500ms, use `:model-value`
5. ✅ **Use CurrencyInput for money fields** - not v-text-field
6. ✅ **Create unique text field components** - for unique validation
7. ✅ **Use excludingIds array with filters** - not excludeId with where
8. ✅ **Validate forms before saving** - both create and edit
9. ✅ **Pass through props** - label, rules, required
10. ✅ **Update all 3 integration files** - routes, nav, metrics

---

## Testing Checklist

### Backend
- [ ] Model scopes work (search, excludingIds)
- [ ] All 5 controller actions return correct responses
- [ ] Policy authorization enforced
- [ ] Services handle errors gracefully

### Frontend
- [ ] List page loads with data
- [ ] Search works with debouncing
- [ ] Pagination works
- [ ] Can create new record
- [ ] Can view record details
- [ ] Can edit record
- [ ] Can delete record
- [ ] Navigation works
- [ ] Breadcrumbs display correctly
- [ ] Form validation works
- [ ] Unique field validation works

---

## Common Pitfalls

1. ❌ Forgetting `establishScopes()` - breaks search/uniqueness
2. ❌ Creating orphaned CreateForm components
3. ❌ Not debouncing search
4. ❌ Using `excludeId` instead of `excludingIds`
5. ❌ Not validating forms
6. ❌ Forgetting QuickMetricsCard update
7. ❌ Not checking policy authorization
8. ❌ Using numbers for money (use strings)
9. ❌ Missing breadcrumbs
10. ❌ Not adding search scope

---

## File Count

**Per model implementation:**
- Backend: 11 new files, 1 updated
- Frontend: 10-11 new files, 3 updated
- **Total: 21-22 new files, 4 updated**

---

## Success Criteria

✅ All CRUD operations work
✅ Search and pagination work
✅ Forms validate correctly
✅ Authorization enforced
✅ Navigation works
✅ No TypeScript errors
✅ Mobile responsive
✅ QuickMetricsCard shows count

---

**Workflow Version:** 1.0
**Last Updated:** 2025-12-09
**Reference:** FundingRegion (commit: `973af90`)
