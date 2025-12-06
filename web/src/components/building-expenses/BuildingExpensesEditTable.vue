<template>
  <EditDataTableVirtual
    :headers="headers"
    :items="buildingExpenses"
    :loading="isLoading"
    :editable-columns="['estimatedCost', 'actualCost']"
    height="630"
    fixed-footer
    disable-sort
    @cancel="restoreBuildingExpense"
  >
    <template #item.buildingExpenseCategoryId="{ item }">
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

    <template #item.estimatedCost.edit="{ item }">
      <v-text-field
        v-model="item.estimatedCost"
        hide-details
        @change="saveBuildingExpenseIfDirty(item)"
      />
    </template>

    <template #item.actualCost.edit="{ item }">
      <v-text-field
        v-model="item.actualCost"
        hide-details
        @change="saveBuildingExpenseIfDirty(item)"
      />
    </template>

    <template #tfoot>
      <tfoot>
        <tr class="bg-grey-lighten-3 font-weight-medium">
          <td>SECTION TOTAL</td>
          <td></td>
          <td>{{ formatMoney(totalEstimatedCost) }}</td>
          <td>{{ formatMoney(totalActualCost) }}</td>
          <td>{{ formatMoney(totalCost) }}</td>
        </tr>
      </tfoot>
    </template>
  </EditDataTableVirtual>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isNil, keyBy, pick } from "lodash"

import { formatMoney } from "@/utils/formatters"
import sumByDecimal from "@/utils/sum-by-decimal"

import buildingExpensesApi, {
  BuildingExpenseAsIndex,
  type BuildingExpense,
} from "@/api/building-expenses-api"
import useBuildingExpenses, {
  type BuildingExpenseFiltersOptions,
  type BuildingExpenseWhereOptions,
  type BuildingExpenseQueryOptions,
} from "@/use/use-building-expenses"
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
  }
})

const { buildingExpenses, isLoading } = useBuildingExpenses(buildingExpensesQuery)

const headers = [
  {
    title: "Category",
    key: "buildingExpenseCategoryId",
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
]

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

const isRowSavingById = ref<Record<number, boolean>>({})

const snack = useSnack()

async function saveBuildingExpenseIfDirty(buildingExpense: BuildingExpense) {
  const currentBuildingExpense = buildingExpensesById.value[buildingExpense.id]
  if (JSON.stringify(currentBuildingExpense) === JSON.stringify(buildingExpense)) return

  isRowSavingById.value[buildingExpense.id] = true
  try {
    const buildingExpenseAttributes = pick(buildingExpense, ["estimatedCost", "actualCost"])
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
    console.error(`Failed to save building expense: ${error}`, { error })
    snack.error(`Failed to save building expense: ${error}`)
  } finally {
    isRowSavingById.value[buildingExpense.id] = false
  }
}

function restoreBuildingExpense(buildingExpense: BuildingExpense) {
  const oldBuildingExpense = buildingExpensesById.value[buildingExpense.id]
  if (isNil(oldBuildingExpense)) return

  buildingExpense.estimatedCost = oldBuildingExpense.estimatedCost
  buildingExpense.actualCost = oldBuildingExpense.actualCost
}
</script>
