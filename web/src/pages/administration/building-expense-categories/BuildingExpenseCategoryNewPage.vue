<template>
  <HeaderActionsFormCard
    ref="headerActionsFormCard"
    title="New Building Expense Category"
    @submit.prevent="createBuildingExpenseCategory"
  >
    <!-- TODO: add ability to select funding region -->
    <v-row>
      <v-col cols="12">
        <BuildingExpenseCategoryCategoryNameUniqueTextField
          v-model="buildingExpenseCategoryAttributes.categoryName"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CurrencyInput
          v-model="buildingExpenseCategoryAttributes.subsidyRate"
          label="Subsidy Rate *"
          :rules="[required]"
          required
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn
        :loading="isLoading"
        color="primary"
        variant="flat"
        type="submit"
      >
        Create Building Expense Category
      </v-btn>
      <v-spacer />
      <v-btn
        color="warning"
        variant="outlined"
        :loading="isLoading"
        :to="{
          name: 'administration/BuildingExpenseCategoriesPage',
        }"
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

import buildingExpenseCategoriesApi, {
  type BuildingExpenseCategory,
} from "@/api/building-expense-categories-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"

import CurrencyInput from "@/components/CurrencyInput.vue"
import BuildingExpenseCategoryCategoryNameUniqueTextField from "@/components/building-expense-categories/BuildingExpenseCategoryCategoryNameUniqueTextField.vue"
import HeaderActionsFormCard from "@/components/common/HeaderActionsFormCard.vue"

const buildingExpenseCategoryAttributes = ref<Partial<BuildingExpenseCategory>>({
  fundingRegionId: undefined,
  categoryName: "",
  subsidyRate: "",
})

const headerActionsFormCard = ref<InstanceType<typeof HeaderActionsFormCard> | null>(null)
const isLoading = ref(false)
const snack = useSnack()
const router = useRouter()

async function createBuildingExpenseCategory() {
  if (isNil(headerActionsFormCard.value)) return

  const { valid } = await headerActionsFormCard.value.validate()
  if (!valid) return

  isLoading.value = true
  try {
    const { buildingExpenseCategory } = await buildingExpenseCategoriesApi.create(
      buildingExpenseCategoryAttributes.value
    )
    snack.success("Building expense category created successfully!")
    return router.push({
      name: "administration/building-expense-categories/BuildingExpenseCategoryPage",
      params: {
        buildingExpenseCategoryId: buildingExpenseCategory.id,
      },
    })
  } catch (error) {
    console.error(`Failed to create building expense category: ${error}`, { error })
    snack.error(`Failed to create building expense category: ${error}`)
  } finally {
    isLoading.value = false
  }
}

useBreadcrumbs("Building Expense Category Creation", [
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
    title: "New Building Expense Category",
    to: {
      name: "administration/building-expense-categories/BuildingExpenseCategoryNewPage",
    },
  },
])
</script>
