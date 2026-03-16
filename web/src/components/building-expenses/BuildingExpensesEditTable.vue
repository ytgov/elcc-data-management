<template>
  <EditDataTableVirtual
    :headers="headers"
    :items="buildingExpenses"
    :loading="isLoading || isSaving || !isNil(isDeletingBuildingExpenseId)"
    :editable-columns="editableColumns"
    height="630"
    fixed-footer
    disable-sort
    @update:cell="saveBuildingExpenseIfDirty"
  >
    <template #item.categoryId="{ item }">
      <BuildingExpenseCategoryAttributesChip :building-expense-category="item.category" />
    </template>

    <template #item.estimatedCost="{ item }">
      {{ formatMoney(item.estimatedCost) }}
    </template>

    <template #item.actualCost="{ item }">
      {{ formatMoney(item.actualCost) }}
    </template>

    <template #item.totalCost="{ item }">
      {{ formatMoney(item.totalCost) }}
    </template>

    <template #item.subsidyRate.edit="{ item }">
      <v-text-field
        v-model="item.subsidyRate"
        hide-details
      />
    </template>

    <template #item.estimatedCost.edit="{ item }">
      <v-text-field
        v-model="item.estimatedCost"
        hide-details
      />
    </template>

    <template #item.actualCost.edit="{ item }">
      <v-text-field
        v-model="item.actualCost"
        hide-details
      />
    </template>

    <template #item.notes.edit="{ item }">
      <v-textarea
        v-model="item.notes"
        hide-details
        rows="3"
      />
    </template>

    <template #item.actions="{ item }">
      <v-btn
        v-if="item.policy.destroy"
        color="error"
        variant="outlined"
        size="small"
        :loading="isDeletingBuildingExpenseId === item.id"
        @click.stop="deleteBuildingExpense(item)"
      >
        Delete
      </v-btn>
    </template>

    <template #tfoot>
      <tfoot>
        <tr class="bg-grey-lighten-3 font-weight-medium">
          <td>SECTION TOTAL</td>
          <td></td>
          <td>{{ formatMoney(totalEstimatedCost) }}</td>
          <td>{{ formatMoney(totalActualCost) }}</td>
          <td>{{ formatMoney(totalCost) }}</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </template>
  </EditDataTableVirtual>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isNil, keyBy, pick } from "lodash"

import { formatMoney } from "@/utils/formatters"
import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import sumByDecimal from "@/utils/sum-by-decimal"

import { MAX_PER_PAGE } from "@/api/base-api"
import buildingExpensesApi, {
  BuildingExpenseAsIndex,
  type BuildingExpense,
} from "@/api/building-expenses-api"
import useBuildingExpenses, {
  type BuildingExpenseFiltersOptions,
  type BuildingExpenseWhereOptions,
  type BuildingExpenseQueryOptions,
} from "@/use/use-building-expenses"
import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"

import EditDataTableVirtual from "@/components/common/EditDataTableVirtual.vue"
import BuildingExpenseCategoryAttributesChip from "@/components/building-expense-categories/BuildingExpenseCategoryAttributesChip.vue"

const props = withDefaults(
  defineProps<{
    where?: BuildingExpenseWhereOptions
    filters?: BuildingExpenseFiltersOptions
  }>(),
  {
    where: () => ({}),
    filters: () => ({}),
  }
)

const buildingExpensesQuery = computed<BuildingExpenseQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: MAX_PER_PAGE,
  }
})

const { buildingExpenses, isLoading, refresh } = useBuildingExpenses(buildingExpensesQuery)

const headers = [
  {
    title: "Category",
    key: "categoryId",
  },
  {
    title: "Subsidy Rate / $",
    key: "subsidyRate",
  },
  {
    title: "Estimated Cost",
    key: "estimatedCost",
  },
  {
    title: "Actual Cost",
    key: "actualCost",
  },
  {
    title: "Total Cost",
    key: "totalCost",
  },
  {
    title: "Notes",
    key: "notes",
    width: "16rem",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "center" as const,
  },
]

const { isSystemAdmin } = useCurrentUser()
const editableColumns = computed(() => {
  const columns = ["estimatedCost", "actualCost", "notes"]

  if (isSystemAdmin.value) {
    columns.unshift("subsidyRate")
  }

  return columns
})

const totalEstimatedCost = computed(() => {
  return sumByDecimal(buildingExpenses.value, "estimatedCost").toFixed(4)
})

const totalActualCost = computed(() => {
  return sumByDecimal(buildingExpenses.value, "actualCost").toFixed(4)
})

const totalCost = computed(() => {
  return sumByDecimal(buildingExpenses.value, "totalCost").toFixed(4)
})

const buildingExpensesById = computed<Record<number, BuildingExpenseAsIndex>>(() =>
  keyBy(buildingExpenses.value, "id")
)
const buildingExpenseIdToIndex = computed<Record<number, number>>(() =>
  Object.fromEntries(
    buildingExpenses.value.map((buildingExpense, index) => [buildingExpense.id, index])
  )
)

const isSaving = ref(false)
const snack = useSnack()

async function saveBuildingExpenseIfDirty(buildingExpense: BuildingExpense) {
  const currentBuildingExpense = buildingExpensesById.value[buildingExpense.id]
  if (JSON.stringify(currentBuildingExpense) === JSON.stringify(buildingExpense)) return

  isSaving.value = true
  try {
    const buildingExpenseAttributes = pick(buildingExpense, [
      "subsidyRate",
      "estimatedCost",
      "actualCost",
      "notes",
    ])
    const { buildingExpense: updatedBuildingExpense } = await buildingExpensesApi.update(
      buildingExpense.id,
      buildingExpenseAttributes
    )

    const buildingExpenseIndex = buildingExpenseIdToIndex.value[buildingExpense.id]
    if (isNil(buildingExpenseIndex)) return

    buildingExpenses.value.splice(buildingExpenseIndex, 1, {
      ...currentBuildingExpense,
      ...updatedBuildingExpense,
    })

    snack.success("Building expense saved!")
  } catch (error) {
    await refresh()

    console.error(`Failed to save building expense: ${error}`, { error })
    snack.error(`Failed to save building expense: ${error}`)
  } finally {
    isSaving.value = false
  }
}

const isDeletingBuildingExpenseId = ref<number | null>(null)

async function deleteBuildingExpense(buildingExpense: BuildingExpense) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this building expense?")) return

  isDeletingBuildingExpenseId.value = buildingExpense.id
  try {
    await buildingExpensesApi.delete(buildingExpense.id)
    await refresh()
    snack.success("Building expense deleted!")
  } catch (error) {
    console.error(`Failed to delete building expense: ${error}`, { error })
    snack.error(`Failed to delete building expense: ${error}`)
  } finally {
    isDeletingBuildingExpenseId.value = null
  }
}

defineExpose({
  refresh,
})
</script>
