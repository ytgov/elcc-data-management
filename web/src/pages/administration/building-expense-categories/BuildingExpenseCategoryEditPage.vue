<template>
  <HeaderActionsCard title="Edit Building Expense Category">
    <BuildingExpenseCategoryEditForm
      :building-expense-category-id="buildingExpenseCategoryIdAsNumber"
      @saved="redirectToBuildingExpenseCategoryPage"
    />
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import BuildingExpenseCategoryEditForm from "@/components/building-expense-categories/BuildingExpenseCategoryEditForm.vue"

const router = useRouter()

const props = defineProps<{
  buildingExpenseCategoryId: string
}>()

const buildingExpenseCategoryIdAsNumber = computed(() => parseInt(props.buildingExpenseCategoryId))

function redirectToBuildingExpenseCategoryPage(buildingExpenseCategoryId: number) {
  return router.push({
    name: "administration/building-expense-categories/BuildingExpenseCategoryPage",
    params: {
      buildingExpenseCategoryId,
    },
  })
}

const breadcrumbs = [
  {
    title: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    title: "Building Expense Categories",
    to: {
      name: "administration/BuildingExpenseCategoriesPage",
    },
  },
  {
    title: "Edit",
    to: {
      name: "administration/building-expense-categories/BuildingExpenseCategoryEditPage",
      params: {
        buildingExpenseCategoryId: props.buildingExpenseCategoryId,
      },
    },
  },
]

useBreadcrumbs("Edit", breadcrumbs)
</script>
