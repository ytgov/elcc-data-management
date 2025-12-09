<template>
  <UniqueTextField
    v-model="categoryName"
    label="Category name"
    :check-availability="checkCategoryNameAvailability"
    unique-validation-message="Category name must be unique"
    is-unique-message="Category name is available"
    is-not-unique-message="Category name is already taken"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isEmpty } from "lodash"

import buildingExpenseCategoriesApi from "@/api/building-expense-categories-api"

import UniqueTextField from "@/components/common/UniqueTextField.vue"

const categoryName = defineModel<string | null | undefined>({
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

  return {
    excludingIds: props.excludingIds,
  }
})

async function checkCategoryNameAvailability(name: string) {
  const { buildingExpenseCategories } = await buildingExpenseCategoriesApi.list({
    where: {
      categoryName: name,
    },
    filters: filters.value,
  })

  return buildingExpenseCategories.length === 0
}
</script>
