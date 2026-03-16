<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="allBuildingExpenseCategories"
    label="Category"
    hint="Search for a building expense category."
    item-value="id"
    auto-select-first
    chips
    clearable
    hide-selected
    no-filter
    persistent-hint
    :rules="rules"
    @update:model-value="emit('update:modelValue', $event)"
    @update:search="debouncedUpdateSearchToken"
    @click:clear="reset"
  >
    <template #chip="{ props: chipProps, item: { raw: result } }">
      <BuildingExpenseCategoryAttributesChip
        v-if="!isNil(result) && !isNumber(result)"
        v-bind="chipProps"
        :building-expense-category="result"
      />
      <v-chip
        v-else
        v-bind="chipProps"
        :text="'Unknown#' + JSON.stringify(result)"
      />
    </template>
    <template #item="{ props: itemProps, item: { raw: result } }">
      <v-list-item
        v-if="!isNil(result.id)"
        v-bind="safeItemProps(itemProps)"
        :title="result.categoryName"
      />
      <v-list-item
        v-else
        v-bind="safeItemProps(itemProps)"
        :title="'Unknown#' + (result.id || JSON.stringify(result))"
      />
    </template>
    <template
      v-if="hasMore"
      #append-item
    >
      <v-divider />
      <v-list-item
        class="text-primary text-center"
        title="Show More"
        @click="nextPage"
      />
    </template>
    <template #no-data>
      <div class="d-flex align-center px-4 py-3 text-body-1">
        Can't find what you're looking for?
        <v-spacer />
        <v-btn
          v-if="isSystemAdmin"
          color="primary"
          variant="text"
          :to="{
            name: 'administration/building-expense-categories/BuildingExpenseCategoryNewPage',
          }"
        >
          Create Category
        </v-btn>
        <v-btn
          v-else
          color="primary"
          variant="text"
          href="mailto:help+elcc@icefoganalytics.com?subject=Building%20Expense%20Category%20Request"
        >
          Contact Admin
        </v-btn>
      </div>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
export {
  type BuildingExpenseCategoryAsIndex,
  type BuildingExpenseCategoryWhereOptions,
  type BuildingExpenseCategoryFiltersOptions,
  type BuildingExpenseCategoryQueryOptions,
} from "@/use/use-building-expense-categories"
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { debounce, isEmpty, isNil, isNumber, omit, uniqBy } from "lodash"

import useBuildingExpenseCategories, {
  type BuildingExpenseCategoryAsIndex,
  type BuildingExpenseCategoryFiltersOptions,
  type BuildingExpenseCategoryQueryOptions,
  type BuildingExpenseCategoryWhereOptions,
} from "@/use/use-building-expense-categories"
import useCurrentUser from "@/use/use-current-user"

import BuildingExpenseCategoryAttributesChip from "@/components/building-expense-categories/BuildingExpenseCategoryAttributesChip.vue"

type ValidationRule = (value: unknown) => boolean | string

const props = defineProps<{
  modelValue: number | null | undefined
  where?: BuildingExpenseCategoryWhereOptions
  filters?: Omit<BuildingExpenseCategoryFiltersOptions, "search">
  rules?: ValidationRule[]
}>()

const emit = defineEmits<{
  "update:modelValue": [buildingExpenseCategoryId: number | null | undefined]
}>()

const { isSystemAdmin } = useCurrentUser()

const searchToken = ref("")

function updateSearchToken(value: string) {
  searchToken.value = value
  page.value = 1
}

const debouncedUpdateSearchToken = debounce(updateSearchToken, 500)

const searchFilter = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return {}

  return {
    search: searchToken.value.trim(),
  }
})

const perPage = computed(() => {
  if (isNil(searchToken.value) || isEmpty(searchToken.value)) return 100

  return 20
})

const page = ref(1)

const buildingExpenseCategoriesQuery = computed<BuildingExpenseCategoryQueryOptions>(() => ({
  where: props.where,
  filters: {
    ...props.filters,
    ...searchFilter.value,
  },
  perPage: perPage.value,
  page: page.value,
}))

const { buildingExpenseCategories, totalCount, isLoading, refresh } = useBuildingExpenseCategories(
  buildingExpenseCategoriesQuery
)

const selectedBuildingExpenseCategoryQuery = computed<BuildingExpenseCategoryQueryOptions>(() => {
  if (isNil(props.modelValue)) {
    return {
      perPage: 1,
    }
  }

  return {
    where: {
      id: props.modelValue,
    },
    perPage: 1,
  }
})

const { buildingExpenseCategories: selectedBuildingExpenseCategories } =
  useBuildingExpenseCategories(selectedBuildingExpenseCategoryQuery, {
    skipWatchIf: () => isNil(props.modelValue),
  })

const selectedBuildingExpenseCategory = computed(() => selectedBuildingExpenseCategories.value[0])

const allBuildingExpenseCategories = computed<BuildingExpenseCategoryAsIndex[]>(() => {
  if (isNil(selectedBuildingExpenseCategory.value)) {
    return buildingExpenseCategories.value
  }

  return uniqBy([...buildingExpenseCategories.value, selectedBuildingExpenseCategory.value], "id")
})

function safeItemProps(itemProps: Record<string, unknown>) {
  return omit(itemProps, ["title"])
}

async function reset() {
  searchToken.value = ""
  await refresh()
}

watch(
  () => props.modelValue,
  async (newModelValue) => {
    if (isEmpty(newModelValue)) {
      await reset()
    }
  }
)

const hasMore = computed(() => page.value * perPage.value < totalCount.value)

function nextPage() {
  page.value += 1
}

defineExpose({
  reset,
})
</script>
