<template>
  <v-skeleton-loader
    v-if="isNil(buildingExpenseCategory)"
    type="card"
  />
  <HeaderActionsCard
    v-else
    title="Building Expense Category Details"
  >
    <template #header-actions>
      <v-btn
        color="primary"
        :to="{
          name: 'administration/building-expense-categories/BuildingExpenseCategoryEditPage',
          params: {
            buildingExpenseCategoryId,
          },
        }"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="policy?.destroy"
        class="mt-2 mt-md-0 ml-md-2"
        color="error"
        :loading="isDeleting"
        @click="deleteBuildingExpenseCategory(buildingExpenseCategoryIdAsNumber)"
      >
        Delete
      </v-btn>
    </template>

    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <DescriptionElement
          label="Funding Region"
          vertical
        >
          <FundingRegionChip :funding-region-id="buildingExpenseCategory.fundingRegionId" />
        </DescriptionElement>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <DescriptionElement
          label="Category name"
          :model-value="buildingExpenseCategory.categoryName"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <DescriptionElement
          label="Subsidy Rate"
          vertical
        >
          {{ Big(buildingExpenseCategory.subsidyRate).mul(100).toFixed(0) }} cents / $
        </DescriptionElement>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <DescriptionElement
          label="Created At"
          :model-value="formatDate(buildingExpenseCategory.createdAt)"
          vertical
        />
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <DescriptionElement
          label="Updated At"
          :model-value="formatDate(buildingExpenseCategory.updatedAt)"
          vertical
        />
      </v-col>
    </v-row>
  </HeaderActionsCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"
import Big from "big.js"

import { formatDate } from "@/utils/formatters"
import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"

import buildingExpenseCategoriesApi from "@/api/building-expense-categories-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useBuildingExpenseCategory from "@/use/use-building-expense-category"
import useSnack from "@/use/use-snack"

import DescriptionElement from "@/components/common/DescriptionElement.vue"
import HeaderActionsCard from "@/components/common/HeaderActionsCard.vue"
import FundingRegionChip from "@/components/funding-regions/FundingRegionChip.vue"

const props = defineProps<{
  buildingExpenseCategoryId: string
}>()

const buildingExpenseCategoryIdAsNumber = computed(() => parseInt(props.buildingExpenseCategoryId))

const { buildingExpenseCategory, policy } = useBuildingExpenseCategory(
  buildingExpenseCategoryIdAsNumber
)

const isDeleting = ref(false)
const snack = useSnack()
const router = useRouter()

async function deleteBuildingExpenseCategory(buildingExpenseCategoryId: number) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this building expense category?"))
    return

  isDeleting.value = true
  try {
    await buildingExpenseCategoriesApi.delete(buildingExpenseCategoryId)
    snack.success("Building expense category deleted.")
    return router.push({
      name: "administration/BuildingExpenseCategoriesPage",
    })
  } catch (error) {
    console.error(`Failed to delete building expense category: ${error}`, { error })
    snack.error(`Failed to delete building expense category: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

const title = computed(
  () => buildingExpenseCategory.value?.categoryName || "Building Expense Category"
)
const buildingExpenseCategoryTitle = computed(
  () => buildingExpenseCategory.value?.categoryName || "Details"
)

const breadcrumbs = computed(() => [
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
    title: buildingExpenseCategoryTitle.value,
    to: {
      name: "administration/building-expense-categories/BuildingExpenseCategoryPage",
      params: {
        buildingExpenseCategoryId: props.buildingExpenseCategoryId,
      },
    },
  },
])

useBreadcrumbs(title, breadcrumbs)
</script>
