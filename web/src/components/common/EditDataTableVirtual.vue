<template>
  <v-data-table-virtual
    :items="items"
    :headers="headers"
  >
    <template #item="{ index, item, itemRef }">
      <tr
        v-if="!isRowEditing(index)"
        :ref="itemRef"
        class="cursor-pointer"
        @click="startEditingRow(index, editableColumns[0])"
      >
        <template
          v-for="{ key: headerKey } in headers"
          :key="headerKey"
        >
          <td
            v-if="isEditableColumn(headerKey)"
            @click.capture.stop="startEditingRow(index, headerKey)"
          >
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
          <td v-else>
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
        </template>
      </tr>
      <tr
        v-else
        :ref="itemRef"
        @focusout="saveAndExitEditMode(index)"
      >
        <template
          v-for="{ key: headerKey } in headers"
          :key="headerKey"
        >
          <td
            v-if="isEditableColumn(headerKey)"
            :ref="(element: unknown) => setFieldRef(headerKey, index, element)"
            @keydown="navigateOnKeydown($event, headerKey, index)"
          >
            <slot
              :key="`${itemsVersion}-${headerKey}-${index}`"
              :name="`item.${headerKey}.edit`"
              :item="cloneDeep(item)"
              :index="index"
            >
              <v-text-field
                :model-value="item[headerKey]"
                hide-details
              />
            </slot>
          </td>
          <td v-else>
            <slot
              :name="`item.${headerKey}`"
              :item="item"
              :index="index"
            >
              {{ item[headerKey] }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      ></slot>
    </template>
  </v-data-table-virtual>
</template>

<script
  setup
  lang="ts"
  generic="
    Header extends Record<string, unknown> & {
      key: string
    },
    Item extends Record<string, unknown>,
    ColumnKey extends string
  "
>
import { type ComponentPublicInstance, computed, nextTick, ref, watch } from "vue"
import cloneDeep from "lodash/cloneDeep"
import { isNil } from "lodash"

import convertIndexToAlphaIndex from "@/utils/convert-index-to-alpha-index"

const props = defineProps<{
  headers: Header[]
  items: Item[]
  editableColumns: ColumnKey[]
}>()

const emit = defineEmits<{
  cancel: [item: Item]
}>()

const columnsAsAlphaIndexMap = computed(() => {
  const initialMap: Record<string, string> = {}
  return props.editableColumns.reduce<Record<ColumnKey, string>>(
    (labelsByColumnKey, columnKey, index) => {
      labelsByColumnKey[columnKey] = convertIndexToAlphaIndex(index)
      return labelsByColumnKey
    },
    initialMap
  )
})

const editingRowIndex = ref<number | null>(null)

const itemsVersion = ref<number>(0)

watch(
  () => props.items,
  () => {
    itemsVersion.value += 1
  },
  { deep: true }
)

const fieldRefs = ref<Record<string, HTMLElement | null>>({})

function isRowEditing(rowIndex: number): boolean {
  return editingRowIndex.value === rowIndex
}

async function startEditingRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  if (isRowEditing(rowIndex)) return

  editingRowIndex.value = rowIndex

  await nextTick()

  focusOnField(columnKey, rowIndex)
}

function cancelEditingRow(rowIndex: number): void {
  const row = props.items[rowIndex]
  if (row) {
    emit("cancel", row)
  }

  editingRowIndex.value = null
}

function saveAndExitEditMode(rowIndex: number): void {
  window.setTimeout(() => {
    if (!isRowEditing(rowIndex)) return
    if (isRowFocused(rowIndex)) return

    editingRowIndex.value = null
  }, 0)
}

function isRowFocused(rowIndex: number): boolean {
  const activeElement = document.activeElement
  if (isNil(activeElement)) return false

  for (const columnKey of props.editableColumns) {
    const columnAlphaIndex = columnsAsAlphaIndexMap.value[columnKey]
    const cellKey = `${columnAlphaIndex}${rowIndex}`
    const tdElement = fieldRefs.value[cellKey]
    if (isNil(tdElement)) return false

    const element = extractElement(tdElement)

    if (element?.contains(activeElement)) {
      return true
    }
  }

  return false
}

function extractElement(field: HTMLElement | ComponentPublicInstance | null): HTMLElement | null {
  if (isNil(field)) return null
  if (field instanceof HTMLElement) return field

  const componentRoot = (field as ComponentPublicInstance).$el
  return componentRoot instanceof HTMLElement ? componentRoot : null
}

function setFieldRef(columnKey: ColumnKey, rowIndex: number, element: unknown): void {
  const columnAlphaIndex = columnsAsAlphaIndexMap.value[columnKey]
  const cellKey = `${columnAlphaIndex}${rowIndex}`
  if (element instanceof HTMLElement) {
    fieldRefs.value[cellKey] = element
  }
}

function focusOnField(columnKey: ColumnKey, rowIndex: number): void {
  const columnAlphaIndex = columnsAsAlphaIndexMap.value[columnKey]
  const cellKey = `${columnAlphaIndex}${rowIndex}`
  const tdElement = fieldRefs.value[cellKey]
  if (isNil(tdElement)) return

  const element = extractElement(tdElement)
  if (!element) return

  const input = element.querySelector<HTMLInputElement>("input, textarea, select")
  if (isNil(input)) {
    console.warn("Input element not found!")
    return
  }

  input.focus()
  input.select()
}

function navigateOnKeydown(event: KeyboardEvent, columnKey: ColumnKey, rowIndex: number): void {
  const input = event.target as HTMLInputElement | null
  const isTextFullySelected =
    input?.selectionStart === 0 && input?.selectionEnd === input?.value.length

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    goToNextRow(rowIndex, columnKey)
  } else if (event.key === "Enter" && event.shiftKey) {
    event.preventDefault()
    goToPreviousRow(rowIndex, columnKey)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    goToPreviousRow(rowIndex, columnKey)
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    goToNextRow(rowIndex, columnKey)
  } else if (event.key === "ArrowLeft" && isTextFullySelected) {
    event.preventDefault()
    input?.setSelectionRange(0, 0)
  } else if (event.key === "ArrowLeft" && input?.selectionStart === 0) {
    event.preventDefault()
    goToPreviousColumn(rowIndex, columnKey)
  } else if (event.key === "ArrowRight" && isTextFullySelected) {
    event.preventDefault()
    input?.setSelectionRange(input.value.length, input.value.length)
  } else if (event.key === "ArrowRight" && input?.selectionEnd === input?.value.length) {
    event.preventDefault()
    goToNextColumn(rowIndex, columnKey)
  } else if (event.key === "Tab") {
    event.preventDefault()
    if (event.shiftKey) {
      goToPreviousColumn(rowIndex, columnKey)
    } else {
      goToNextColumn(rowIndex, columnKey)
    }
  } else if (event.key === "Escape") {
    event.preventDefault()
    cancelEditingRow(rowIndex)
  }
}

async function goToNextRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  const nextRowIndex = rowIndex + 1
  if (nextRowIndex >= props.items.length) {
    editingRowIndex.value = null
    return
  }

  await startEditingRow(nextRowIndex, columnKey)
}

async function goToPreviousRow(rowIndex: number, columnKey: ColumnKey): Promise<void> {
  if (rowIndex <= 0) {
    editingRowIndex.value = null
    return
  }

  await startEditingRow(rowIndex - 1, columnKey)
}

function goToNextColumn(rowIndex: number, columnKey: ColumnKey): void {
  const columnIndex = props.editableColumns.indexOf(columnKey)
  const nextColumnIndex = columnIndex + 1

  if (nextColumnIndex >= props.editableColumns.length) {
    goToNextRow(rowIndex, props.editableColumns[0])
    return
  }

  const nextColumnKey = props.editableColumns[nextColumnIndex]
  if (nextColumnKey) {
    focusOnField(nextColumnKey, rowIndex)
  }
}

function goToPreviousColumn(rowIndex: number, columnKey: ColumnKey): void {
  const columnIndex = props.editableColumns.indexOf(columnKey)
  const previousColumnIndex = columnIndex - 1

  if (previousColumnIndex < 0) {
    const lastColumnKey = props.editableColumns[props.editableColumns.length - 1]
    if (lastColumnKey) {
      goToPreviousRow(rowIndex, lastColumnKey)
    }
    return
  }

  const previousColumnKey = props.editableColumns[previousColumnIndex]
  if (previousColumnKey) {
    focusOnField(previousColumnKey, rowIndex)
  }
}

function isEditableColumn(columnKey: string | undefined): columnKey is ColumnKey {
  return props.editableColumns.includes(columnKey as ColumnKey)
}
</script>
