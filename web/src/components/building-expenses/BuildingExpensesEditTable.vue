<template>
  <v-data-table-virtual
    :headers="headers"
    :items="buildingExpenses"
    :loading="isLoading"
    height="600"
    disable-sort
  >
    <template #item="{ index, item, itemRef }">
      <tr
        v-if="!isRowEditing(index)"
        :ref="itemRef"
        class="cursor-pointer"
        @click="startEditingRow(index, 'estimated')"
      >
        <td>{{ item.buildingExpenseCategoryId }}</td>
        <td @click.capture.stop="startEditingRow(index, 'estimated')">
          {{ formatMoney(item.estimatedCost) }}
        </td>
        <td @click.capture.stop="startEditingRow(index, 'actual')">
          {{ formatMoney(item.actualCost) }}
        </td>
        <td>{{ formatMoney(item.totalCost) }}</td>
      </tr>
      <tr
        v-else
        :ref="itemRef"
        class="cursor-pointer"
        @focusout="saveAndExitEditMode(index)"
      >
        <td>{{ item.buildingExpenseCategoryId }}</td>
        <td>
          <v-text-field
            :ref="(el) => setEstimatedCostField(index, el)"
            v-model="item.estimatedCost"
            hide-details
            @keydown="handleKeyboardNavigation($event, index, 'estimated')"
          />
        </td>
        <td>
          <v-text-field
            :ref="(el) => setActualCostField(index, el)"
            v-model="item.actualCost"
            hide-details
            @keydown="handleKeyboardNavigation($event, index, 'actual')"
          />
        </td>
        <td>{{ formatMoney(item.totalCost) }}</td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, type ComponentPublicInstance } from "vue"
import { isEmpty, isNil } from "lodash"

import { formatMoney } from "@/utils/formatters"

import buildingExpensesApi from "@/api/building-expenses-api"
import useBuildingExpenses, {
  type BuildingExpenseFiltersOptions,
  type BuildingExpenseWhereOptions,
  type BuildingExpenseQueryOptions,
} from "@/use/use-building-expenses"
import useSnack from "@/use/use-snack"

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

type ColumnName = "estimated" | "actual"

const headers = [
  {
    title: "Category",
    key: "buildingExpenseCategoryId",
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

const estimatedCostFieldRefs = ref<Record<number, HTMLInputElement | null>>({})
const actualCostFieldRefs = ref<Record<number, HTMLInputElement | null>>({})

function setEstimatedCostField(index: number, el: unknown) {
  estimatedCostFieldRefs.value[index] = el as HTMLInputElement | null
}

function setActualCostField(index: number, el: unknown) {
  actualCostFieldRefs.value[index] = el as HTMLInputElement | null
}

const fieldsByColumnName: Record<ColumnName, typeof estimatedCostFieldRefs> = {
  estimated: estimatedCostFieldRefs,
  actual: actualCostFieldRefs,
}

const lastSavedCostsById = ref<Record<number, { estimatedCost: string; actualCost: string }>>({})
const isRowSavingById = ref<Record<number, boolean>>({})

const editingRowIndex = ref<number | null>(null)

function isRowEditing(rowIndex: number): boolean {
  return editingRowIndex.value === rowIndex
}

async function startEditingRow(rowIndex: number, columnName: ColumnName) {
  if (isRowEditing(rowIndex)) return

  const buildingExpense = buildingExpenses.value[rowIndex]

  if (isNil(buildingExpense)) return

  const previousSavedCosts = lastSavedCostsById.value[buildingExpense.id]

  if (isNil(previousSavedCosts)) {
    lastSavedCostsById.value[buildingExpense.id] = {
      estimatedCost: buildingExpense.estimatedCost,
      actualCost: buildingExpense.actualCost,
    }
  }

  if (!isNil(editingRowIndex.value) && editingRowIndex.value !== rowIndex) {
    saveRowIfDirty(editingRowIndex.value)
  }

  editingRowIndex.value = rowIndex

  await nextTick()

  focusOnField(rowIndex, columnName)
}

function handleKeyboardNavigation(event: KeyboardEvent, rowIndex: number, columnName: ColumnName) {
  if (event.key === "Enter" || event.key === "ArrowDown") {
    event.preventDefault()
    goToNextRow(rowIndex, columnName)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    goToPreviousRow(rowIndex, columnName)
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    goToNextColumn(rowIndex, columnName)
  } else if (event.key === "ArrowLeft") {
    event.preventDefault()
    goToPreviousColumn(rowIndex, columnName)
  } else if (event.key === "Tab") {
    event.preventDefault()

    if (event.shiftKey) {
      goToPreviousColumn(rowIndex, columnName)
    } else {
      goToNextColumn(rowIndex, columnName)
    }
  } else if (event.key === "Escape") {
    event.preventDefault()
    cancelEditingRow(rowIndex)
  }
}

function goToNextColumn(rowIndex: number, columnName: ColumnName) {
  if (columnName === "estimated") {
    focusOnField(rowIndex, "actual")
    return
  }

  goToNextRow(rowIndex, "estimated")
}

function goToPreviousColumn(rowIndex: number, columnName: ColumnName) {
  if (columnName === "actual") {
    focusOnField(rowIndex, "estimated")
    return
  }

  goToPreviousRow(rowIndex, "actual")
}

function saveAndExitEditMode(rowIndex: number) {
  window.setTimeout(() => {
    if (!isRowEditing(rowIndex)) return
    if (isRowFocused(rowIndex)) return

    saveRowIfDirty(rowIndex)
    editingRowIndex.value = null
  }, 0)
}

function isRowFocused(rowIndex: number): boolean {
  const activeElement = document.activeElement

  if (isNil(activeElement)) {
    return false
  }

  const estimatedField = estimatedCostFieldRefs.value[rowIndex]
  const actualField = actualCostFieldRefs.value[rowIndex]

  const estimatedRoot = extractElement(estimatedField)
  const actualRoot = extractElement(actualField)

  if (estimatedRoot?.contains(activeElement)) {
    return true
  }

  if (actualRoot?.contains(activeElement)) {
    return true
  }

  return false
}

function extractElement(
  field: HTMLInputElement | ComponentPublicInstance | null
): HTMLElement | null {
  if (isNil(field)) {
    return null
  }

  if (field instanceof HTMLElement) {
    return field
  }

  const componentRoot = (field as ComponentPublicInstance).$el

  if (componentRoot instanceof HTMLElement) {
    return componentRoot
  }

  return null
}

function goToNextRow(rowIndex: number, columnName: ColumnName) {
  saveRowIfDirty(rowIndex)

  const nextIndex = rowIndex + 1

  if (nextIndex >= buildingExpenses.value.length) {
    editingRowIndex.value = null
    return
  }

  startEditingRow(nextIndex, columnName)
}

function goToPreviousRow(rowIndex: number, columnName: ColumnName) {
  saveRowIfDirty(rowIndex)

  if (rowIndex <= 0) {
    editingRowIndex.value = null
    return
  }

  const previousIndex = rowIndex - 1

  startEditingRow(previousIndex, columnName)
}

function focusOnField(rowIndex: number, columnName: ColumnName) {
  const fields = fieldsByColumnName[columnName].value
  const field = fields[rowIndex]

  if (isNil(field)) {
    return
  }

  field.focus()
  field.select()
}

const snack = useSnack()

function cancelEditingRow(rowIndex: number) {
  const buildingExpense = buildingExpenses.value[rowIndex]

  if (isNil(buildingExpense)) {
    return
  }

  const lastSavedCosts = lastSavedCostsById.value[buildingExpense.id]

  if (!isNil(lastSavedCosts)) {
    buildingExpense.estimatedCost = lastSavedCosts.estimatedCost
    buildingExpense.actualCost = lastSavedCosts.actualCost
  }

  editingRowIndex.value = null
}

async function saveRowIfDirty(rowIndex: number) {
  const buildingExpense = buildingExpenses.value[rowIndex]

  if (isNil(buildingExpense)) {
    return
  }

  const lastSavedCosts = lastSavedCostsById.value[buildingExpense.id] ?? {
    estimatedCost: buildingExpense.estimatedCost,
    actualCost: buildingExpense.actualCost,
  }

  const hasEstimatedCostChanged = buildingExpense.estimatedCost !== lastSavedCosts.estimatedCost
  const hasActualCostChanged = buildingExpense.actualCost !== lastSavedCosts.actualCost

  if (!hasEstimatedCostChanged && !hasActualCostChanged) {
    return
  }

  if (isRowSavingById.value[buildingExpense.id] === true) {
    return
  }

  isRowSavingById.value[buildingExpense.id] = true

  const estimatedCost = normalizeDecimalString(buildingExpense.estimatedCost)
  const actualCost = normalizeDecimalString(buildingExpense.actualCost)

  try {
    const { buildingExpense: updatedBuildingExpense } = await buildingExpensesApi.update(
      buildingExpense.id,
      {
        estimatedCost,
        actualCost,
      }
    )

    buildingExpense.estimatedCost = updatedBuildingExpense.estimatedCost
    buildingExpense.actualCost = updatedBuildingExpense.actualCost

    lastSavedCostsById.value[buildingExpense.id] = {
      estimatedCost: updatedBuildingExpense.estimatedCost,
      actualCost: updatedBuildingExpense.actualCost,
    }

    snack.success("Building expense saved")
  } catch (error) {
    console.error(`Failed to save building expense: ${error}`, { error })
    snack.error(`Failed to save building expense: ${error}`)
  } finally {
    isRowSavingById.value[buildingExpense.id] = false
  }
}

function normalizeDecimalString(value: string): string {
  if (isEmpty(value)) {
    return "0.0000"
  }

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return "0.0000"
  }

  return numericValue.toFixed(4)
}
</script>
